import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { activityLog } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, status, color, startDate, endDate } = body;

  if (!name || !status) {
    return NextResponse.json(
      { error: "name and status can't be empty" },
      { status: 400 }
    );
  }

  const existingProjects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
      name: {
        startsWith: name,
      },
    },
    select: { name: true },
  });

  let finalName = name;

  if (existingProjects.length > 0) {
    let maxSuffix = 0;
    for (const p of existingProjects) {
      const match = p.name.match(/\((\d+)\)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSuffix) maxSuffix = num;
      } else if (p.name === name) {
        if (maxSuffix === 0) maxSuffix = 0;
      }
    }
    finalName = `${name} (${maxSuffix + 1})`;
  }

  const project = await prisma.project.create({
    data: {
      name: finalName,
      description,
      status: status ?? "active",
      color,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      userId: session.user.id,
    },
  });

  activityLog({
    action: `Created project`,
    details: `Created project "${finalName}"`,
    userId: session.user.id,
    projectId: project.id,
  });

  return NextResponse.json(project);
}
