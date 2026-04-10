"use client";

import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const painPoints = [
  {
    quote:
      "Important tasks get buried in group chats, outdated spreadsheets, or sticky notes no one ever checks again.",
    name: "Lost Tasks",
    title: "Scattered across chats & docs",
  },
  {
    quote:
      "Progress is invisible. Deadlines slip by, and you end up chasing everyone one by one just to get a status update.",
    name: "No Visibility",
    title: "Who's doing what? No idea.",
  },
  {
    quote:
      "One app for tasks, another for reports, email for updates — everything is disconnected and wasting your team's time.",
    name: "Tool Overload",
    title: "Too many tools, nothing connects",
  },
  {
    quote:
      "Meetings that should've been a dashboard. Hours spent compiling reports that are already outdated by the time they're shared.",
    name: "Wasted Time",
    title: "Status meetings that go nowhere",
  },
  {
    quote:
      "New team members take weeks to understand what's going on. There's no single source of truth for project state.",
    name: "Onboarding Chaos",
    title: "No single source of truth",
  },
  {
    quote:
      "Priorities shift but nobody updates the plan. Half the team is working on the wrong thing without realizing it.",
    name: "Misaligned Priorities",
    title: "Everyone's busy, nothing ships",
  },
];

export function PainPointsCarousel() {
  return (
    <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={painPoints}
        direction="left"
        speed="slow"
      />
    </div>
  );
}
