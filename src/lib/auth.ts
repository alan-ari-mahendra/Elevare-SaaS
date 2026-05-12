import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import prisma from "@/lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"

const db = prisma as any

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.trim().toLowerCase()

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            avatarUrl: true,
          },
        })

        if (!user || !user.password) return null

        const subscription = await db.subscription.findUnique({
          where: { userId: user.id },
          select: {
            plan: true,
            status: true,
          },
        })

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl ?? undefined,
          subscription: subscription
            ? {
                plan: subscription.plan,
                status: subscription.status,
              }
            : null,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 12,
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        if ((user as any).subscription) {
          token.subscriptionPlan = (user as any).subscription.plan
          token.subscriptionStatus = (user as any).subscription.status
        }
      }

      // Handle session update (useSession().update())
      if (trigger === 'update' && session) {
        // Re-fetch subscription from DB
        const subscription = await db.subscription.findUnique({
          where: { userId: token.id as string },
          select: {
            plan: true,
            status: true,
          },
        })
        if (subscription) {
          token.subscriptionPlan = subscription.plan
          token.subscriptionStatus = subscription.status
        } else {
          token.subscriptionPlan = 'free'
          token.subscriptionStatus = 'active'
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      if (token.name !== undefined) {
        session.user.name = token.name as string | null
      }
      if (token.email !== undefined) {
        session.user.email = token.email as string | null
      }
      if (token.picture !== undefined) {
        session.user.image = token.picture as string | null
      }
      if (token.subscriptionPlan) {
        session.user.subscription = {
          plan: token.subscriptionPlan,
          status: token.subscriptionStatus || 'active',
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}