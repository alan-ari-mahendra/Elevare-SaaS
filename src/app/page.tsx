import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  Zap,
  Star,
  GripVertical,
  Quote,
} from "lucide-react"
import Link from "next/link"
import { FeaturesGrid } from "@/components/features-grid"
import { PainPointsCarousel } from "@/components/pain-points-carousel"

function MockKanban() {
  const columns = [
    {
      title: "To Do",
      color: "bg-slate-400",
      tasks: [
        { name: "Design system tokens", tag: "Design", priority: "high" },
        { name: "API rate limiting", tag: "Backend", priority: "medium" },
      ],
    },
    {
      title: "In Progress",
      color: "bg-indigo-500",
      tasks: [
        { name: "User dashboard UI", tag: "Frontend", priority: "high" },
        { name: "Auth flow refactor", tag: "Backend", priority: "medium" },
        { name: "Write test cases", tag: "QA", priority: "low" },
      ],
    },
    {
      title: "Done",
      color: "bg-emerald-500",
      tasks: [
        { name: "Database migration", tag: "Backend", priority: "medium" },
        { name: "CI/CD pipeline", tag: "DevOps", priority: "high" },
      ],
    },
  ]

  const priorityDot: Record<string, string> = {
    high: "bg-red-400",
    medium: "bg-amber-400",
    low: "bg-blue-400",
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-500/5">
        {/* Mock toolbar */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/70" />
            <div className="h-3 w-3 rounded-full bg-amber-400/70" />
            <div className="h-3 w-3 rounded-full bg-green-400/70" />
          </div>
          <div className="text-xs text-slate-400 font-medium ml-2">Sprint 14 — Elevare</div>
        </div>
        {/* Columns */}
        <div className="grid grid-cols-3 gap-3">
          {columns.map((col) => (
            <div key={col.title} className="space-y-2">
              <div className="flex items-center gap-2 px-1 mb-1">
                <div className={`h-2 w-2 rounded-full ${col.color}`} />
                <span className="text-xs font-semibold text-slate-700">{col.title}</span>
                <span className="text-xs text-slate-400 ml-auto">{col.tasks.length}</span>
              </div>
              {col.tasks.map((task) => (
                <div
                  key={task.name}
                  className="group rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition-all hover:border-indigo-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-1.5">
                    <GripVertical className="h-3.5 w-3.5 text-slate-300 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">{task.name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                          {task.tag}
                        </span>
                        <div className={`h-1.5 w-1.5 rounded-full ${priorityDot[task.priority]}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const testimonials = [
  {
    quote:
      "Elevare transformed how our team collaborates. We've reduced project delivery time by 40% and improved client satisfaction significantly.",
    name: "Sarah Johnson",
    role: "Product Manager, TechCorp",
    initials: "SJ",
    color: "bg-violet-500",
  },
  {
    quote:
      "The analytics and reporting features give us incredible visibility into our projects. It's like having a project management consultant built into the software.",
    name: "Michael Rodriguez",
    role: "CTO, StartupXYZ",
    initials: "MR",
    color: "bg-sky-500",
  },
  {
    quote:
      "Simple, intuitive, and powerful. Elevare strikes the perfect balance between functionality and ease of use. Our team adopted it instantly.",
    name: "Emily Liu",
    role: "Design Lead, CreativeStudio",
    initials: "EL",
    color: "bg-emerald-500",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white light">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Elevare</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#problem" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Why Elevare
              </Link>
              <Link href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Testimonials
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ 1. HERO — Hook & Empathy ═══ */}
      <section className="relative pb-40 pt-20 sm:pt-28 overflow-hidden bg-gradient-to-b from-indigo-100/80 via-indigo-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-white/60 text-indigo-600 border-indigo-200 hover:bg-white/60">
              <Zap className="mr-1 h-3 w-3" />
              Now in Beta
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl text-balance">
              Tired of projects
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                falling apart?
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 text-pretty max-w-2xl mx-auto">
              Missed deadlines, lost tasks, endless status meetings. You&apos;ve been there. There&apos;s a better way to keep your team on track.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
                  Try Elevare free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="default" size="lg" className="h-12 px-8 border-indigo-200 bg-white/60 text-slate-700 hover:bg-white">
                  Live Demo
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map((bg, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full ${bg} border-2 border-white flex items-center justify-center`}
                  >
                    <span className="text-[10px] font-bold text-white">{["A", "K", "M", "J", "S"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-500">
                Trusted by <span className="font-semibold text-slate-900">1,200+</span> teams
              </div>
            </div>
          </div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[128%] h-[180px] lg:h-[70px]"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ═══ 2. PROBLEM — Pain Points ═══ */}
      <section id="problem" className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">Sound familiar?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Managing projects shouldn&apos;t feel this hard
            </h2>
          </div>
        </div>
        <PainPointsCarousel />
      </section>

      {/* ═══ 3. TRANSITION + 4. SOLUTION — Mock Kanban ═══ */}
      <section className="py-20 sm:py-28 bg-slate-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">The solution</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              What if you could manage it all from one place?
            </h2>
            <p className="mt-4 text-lg text-slate-500 text-pretty">
              Meet Elevare — visual boards, drag-and-drop tasks, and real-time progress. Everything your team needs, nothing it doesn&apos;t.
            </p>
          </div>
          <div className="mt-16">
            <MockKanban />
          </div>
        </div>
      </section>

      {/* ═══ 5. FEATURES — Bento Grid ═══ */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-lg text-slate-500 text-pretty">
              Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a clear view of who&apos;s doing what.
            </p>
          </div>
          <div className="mt-16">
            <FeaturesGrid />
          </div>
        </div>
      </section>

      {/* ═══ 6. TESTIMONIALS — Social Proof ═══ */}
      <section id="testimonials" className="py-20 sm:py-28 bg-slate-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Teams already feel the difference
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={i} className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Quote className="absolute top-5 right-5 h-8 w-8 text-slate-100" />
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center space-x-3 mt-5 pt-5 border-t border-slate-100">
                    <div className={`h-10 w-10 rounded-full ${t.color} flex items-center justify-center`}>
                      <span className="text-sm font-semibold text-white">{t.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. CTA — Final Push ═══ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-[400px] w-[400px] rounded-full bg-white/10 blur-[2px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-[300px] w-[300px] rounded-full bg-white/5" />

            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Start managing your projects today
            </h2>
            <p className="relative mt-4 text-lg text-indigo-100 text-pretty max-w-xl mx-auto">
              Free to use, no credit card required. See the difference in your first week.
            </p>
            <div className="relative mt-8">
              <Link href="/register">
                <Button size="lg" className="h-12 px-10 bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Logo centered */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">Elevare</span>
            </div>
          </div>

          {/* Nav links centered */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
            <Link href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Testimonials
            </Link>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Register
            </Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Terms
            </Link>
          </div>

          {/* Dashed divider */}
          <div className="mt-8 border-t border-dashed border-slate-200" />

          {/* Copyright + social icons */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Elevare. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {/* Twitter/X */}
              <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </span>
              {/* LinkedIn */}
              <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </span>
              {/* GitHub */}
              <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </span>
              {/* Instagram */}
              <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
