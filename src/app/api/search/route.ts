import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([]);
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
    take: 10,
  });

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      title: {
        contains: q,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      title: true,
    },
    take: 10,
  });

  const results = [
    ...tasks.map((t) => ({
      type: "task",
      id: t.id,
      name: t.title,
    })),
    ...projects.map((p) => ({
      type: "project",
      id: p.id,
      name: p.name,
    })),
  ];

  return NextResponse.json(results);
}
