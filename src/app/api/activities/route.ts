import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const limitParam = searchParams.get("limit");
  const projectId = searchParams.get("projectId");
  const taskId = searchParams.get("taskId");

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  const activities = await prisma.activity.findMany({
    where: {
      userId: session.user.id,
      ...(projectId ? { projectId } : {}),
      ...(taskId ? { taskId } : {}),
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return NextResponse.json(activities);
}
