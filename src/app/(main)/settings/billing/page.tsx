'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check, Loader2, CreditCard, Crown, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { PLANS, type PlanType } from '@/lib/plans'
import Link from 'next/link'

export default function BillingPage() {
  const { data: session, update } = useSession()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const currentPlan = session?.user?.subscription?.plan || 'free'
  const subscriptionStatus = session?.user?.subscription?.status || 'active'

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success) {
      toast.success('Payment successful! Your subscription has been activated.')
      // Refresh session to get updated subscription
      update()
      // Clean URL
      window.history.replaceState({}, '', '/settings/billing')
    }

    if (canceled) {
      toast.error('Payment was canceled.')
      window.history.replaceState({}, '', '/settings/billing')
    }
  }, [searchParams, update])

  const handleUpgrade = async (plan: PlanType) => {
    if (plan === 'free') return

    setIsLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe
      window.location.href = data.url
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
      setIsLoading(null)
    }
  }

  const planCards = [
    {
      key: 'free' as PlanType,
      name: 'Free',
      description: 'For individuals & small side projects',
      price: 0,
      popular: false,
    },
    {
      key: 'pro' as PlanType,
      name: 'Pro',
      description: 'For growing teams that need more power',
      price: 5,
      popular: true,
    },
    {
      key: 'enterprise' as PlanType,
      name: 'Enterprise',
      description: 'For organizations that need full control',
      price: 10,
      popular: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Billing & Subscription
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing preferences.
        </p>
      </div>

      {/* Current Plan Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Plan</CardTitle>
          <CardDescription>
            Your current subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground capitalize">
                    {PLANS[currentPlan as PlanType]?.name || 'Free'}
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      subscriptionStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : subscriptionStatus === 'past_due'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                    }
                  >
                    {subscriptionStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${PLANS[currentPlan as PlanType]?.price || 0}/month
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {planCards.map((plan) => {
          const isCurrentPlan = currentPlan === plan.key
          const isDowngrade =
            planCards.findIndex((p) => p.key === currentPlan) >
            planCards.findIndex((p) => p.key === plan.key)

          return (
            <Card
              key={plan.key}
              className={`relative flex flex-col ${
                plan.popular
                  ? 'border-primary shadow-md'
                  : isCurrentPlan
                    ? 'border-primary/50'
                    : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-sm">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                </div>

                <Separator className="my-4" />

                <ul className="space-y-2.5">
                  {PLANS[plan.key].features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : isDowngrade ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                    title="Downgrading is not available yet"
                  >
                    Downgrade
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? ''
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={isLoading !== null}
                  >
                    {isLoading === plan.key ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        Upgrade to {plan.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Info Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Test Mode:</strong> This is a sandbox environment. Use
              Stripe test cards for payments.
            </p>
            <p>
              Test card: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">4242 4242 4242 4242</code>
            </p>
            <p>
              Need to test different scenarios?{' '}
              <Link
                href="https://stripe.com/docs/testing"
                target="_blank"
                className="text-primary hover:underline"
              >
                Stripe Testing Documentation
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}