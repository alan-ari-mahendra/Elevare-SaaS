import {
  IconChartBar,
  IconUsers,
  IconCheckbox,
  IconFileAnalytics,
} from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

/* ── Visual headers for each feature card ── */

function AnalyticsHeader() {
  const bars = [35, 55, 45, 70, 60, 80, 50, 65, 75, 90, 68, 85];
  return (
    <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl border border-slate-100 bg-slate-50/50 p-4 overflow-hidden">
      <div className="flex items-end gap-[6px] w-full h-full">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <div
              className="w-full rounded-sm bg-indigo-400/70 transition-all"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 200 100"
      >
        <polyline
          points="10,65 30,50 50,55 70,35 90,40 110,25 130,30 150,20 170,22 190,10"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

function CollaborationHeader() {
  const avatars = [
    { initials: "AK", color: "bg-violet-500" },
    { initials: "JM", color: "bg-sky-500" },
    { initials: "SR", color: "bg-emerald-500" },
  ];
  const messages = [
    { from: 0, text: "Updated the wireframes", time: "2m ago" },
    { from: 1, text: "Looks good! Merging now", time: "1m ago" },
    { from: 2, text: "Nice work team 🎉", time: "Just now" },
  ];
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl border border-slate-100 bg-slate-50/50 p-3 overflow-hidden">
      <div className="flex flex-col gap-2.5 w-full">
        {messages.map((msg, i) => {
          const avatar = avatars[msg.from];
          return (
            <div key={i} className="flex items-start gap-2">
              <div
                className={`h-6 w-6 rounded-full ${avatar.color} flex items-center justify-center shrink-0`}
              >
                <span className="text-[8px] font-bold text-white">
                  {avatar.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                  <p className="text-[11px] text-slate-600">{msg.text}</p>
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5 ml-1">
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskManagementHeader() {
  const tasks = [
    { text: "Design homepage mockup", done: true, priority: "bg-emerald-400" },
    { text: "Setup CI pipeline", done: true, priority: "bg-emerald-400" },
    { text: "Write API endpoints", done: false, priority: "bg-amber-400" },
    { text: "User auth integration", done: false, priority: "bg-red-400" },
  ];
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl border border-slate-100 bg-slate-50/50 p-3 overflow-hidden">
      <div className="flex flex-col gap-1.5 w-full">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md border border-slate-100 bg-white px-2.5 py-2"
          >
            <div
              className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 ${
                task.done
                  ? "border-indigo-500 bg-indigo-500"
                  : "border-slate-300"
              }`}
            >
              {task.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-white">
                  <path
                    d="M2 5L4 7L8 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-[11px] flex-1 ${
                task.done ? "line-through text-slate-400" : "text-slate-600"
              }`}
            >
              {task.text}
            </span>
            <div className={`h-2 w-2 rounded-full ${task.priority} shrink-0`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsHeader() {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl border border-slate-100 bg-slate-50/50 p-4 overflow-hidden">
      <div className="flex gap-4 w-full h-full items-center">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="30" fill="none" stroke="#6366f1" strokeWidth="8"
              strokeDasharray="132 188" strokeDashoffset="0" strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <circle
              cx="40" cy="40" r="30" fill="none" stroke="#10b981" strokeWidth="8"
              strokeDasharray="47 188" strokeDashoffset="-132" strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-700">70%</span>
          </div>
        </div>
        {/* Stats */}
        <div className="flex flex-col gap-2 flex-1">
          {[
            { label: "Completed", value: "128", bar: "w-[70%] bg-indigo-500" },
            { label: "In Progress", value: "42", bar: "w-[25%] bg-emerald-500" },
            { label: "Overdue", value: "8", bar: "w-[5%] bg-red-400" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-slate-400">{stat.label}</span>
                <span className="text-[10px] font-medium text-slate-600">{stat.value}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${stat.bar}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Feature items ── */

const items = [
  {
    title: "Project Analytics",
    description:
      "Real-time insights into project progress, team performance, and resource allocation.",
    header: <AnalyticsHeader />,
    className: "md:col-span-2",
    icon: <IconChartBar className="h-4 w-4 text-indigo-500" />,
  },
  {
    title: "Team Collaboration",
    description:
      "Seamless communication, file sharing, and real-time updates for your entire team.",
    header: <CollaborationHeader />,
    className: "md:col-span-1",
    icon: <IconUsers className="h-4 w-4 text-indigo-500" />,
  },
  {
    title: "Task Management",
    description:
      "Intuitive task creation, assignment, and tracking with customizable kanban workflows.",
    header: <TaskManagementHeader />,
    className: "md:col-span-1",
    icon: <IconCheckbox className="h-4 w-4 text-indigo-500" />,
  },
  {
    title: "Custom Reports",
    description:
      "Generate detailed reports and dashboards tailored to your business needs.",
    header: <ReportsHeader />,
    className: "md:col-span-2",
    icon: <IconFileAnalytics className="h-4 w-4 text-indigo-500" />,
  },
];

export function FeaturesGrid() {
  return (
    <BentoGrid className="max-w-5xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
