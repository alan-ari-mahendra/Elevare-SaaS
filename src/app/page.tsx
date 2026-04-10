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
    <div className="mx-auto mt-16 max-w-4xl">
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
              <Link href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Pricing
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

      {/* Hero Section — Top (gradient bg + headline) */}
      <section className="relative pb-40 pt-20 sm:pt-28 overflow-hidden bg-gradient-to-b from-indigo-100/80 via-indigo-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-white/60 text-indigo-600 border-indigo-200 hover:bg-white/60">
              <Zap className="mr-1 h-3 w-3" />
              Now in Beta
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl text-balance">
              Manage projects,
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                the easy way
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 text-pretty max-w-2xl mx-auto">
              Elevare brings everything your team needs to stay organized — boards, lists, and cards to move work forward and hit every deadline.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
                  Sign up — it&apos;s free!
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 border-indigo-200 bg-white/60 text-slate-700 hover:bg-white">
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

      {/* Hero Section — Bottom (white bg + mock kanban) */}
      <section className="relative pb-20 sm:pb-28 -mt-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MockKanban />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-slate-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              A productivity powerhouse
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Loved by teams everywhere
            </h2>
            <p className="mt-4 text-lg text-slate-500 text-pretty">
              See why thousands of teams choose Elevare to get things done.
            </p>
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

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-[400px] w-[400px] rounded-full bg-white/10 blur-[2px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-[300px] w-[300px] rounded-full bg-white/5" />

            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Start organizing today
            </h2>
            <p className="relative mt-4 text-lg text-indigo-100 text-pretty max-w-xl mx-auto">
              Join thousands of teams already using Elevare to deliver better projects, faster. No credit card required.
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
      <footer className="border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-indigo-500 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-900">Elevare</span>
              </div>
              <p className="text-xs text-slate-400">Project management, simplified.</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                Register
              </Link>
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-8 text-center">
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Elevare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
