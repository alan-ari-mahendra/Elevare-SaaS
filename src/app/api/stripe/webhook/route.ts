import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import type Stripe from 'stripe'

const subscriptionModel = prisma as any

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as string

        if (!userId || !plan) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Create or update subscription
        await subscriptionModel.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.line_items?.data[0]?.price?.id,
            stripeCurrentPeriodEnd: new Date(
              (session.expires_at || Date.now() / 1000) * 1000
            ),
            plan,
            status: 'active',
          },
          update: {
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.line_items?.data[0]?.price?.id,
            stripeCurrentPeriodEnd: new Date(
              (session.expires_at || Date.now() / 1000) * 1000
            ),
            plan,
            status: 'active',
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await subscriptionModel.subscription.update({
            where: { userId },
            data: {
              status: 'canceled',
              plan: 'free',
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (
          invoice as Stripe.Invoice & { subscription?: string | null }
        ).subscription as string

        if (subscriptionId) {
          await subscriptionModel.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'past_due' },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}