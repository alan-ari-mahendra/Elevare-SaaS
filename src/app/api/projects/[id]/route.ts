import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { activityLog } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, status, color, startDate, endDate } = body;

  const existing = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: {
      name,
      description,
      status: status ?? "planning",
      color,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  let details = `Updated project "${updated.name}"`;
  if (existing.status !== updated.status) {
    details += ` status to ${updated.status}`;
  }

  activityLog({
    action: `Updated project`,
    details,
    userId: session.user.id,
    projectId: params.id,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const deleted = await prisma.project.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    activityLog({
      action: `Deleted project`,
      details: `Deleted project "${deleted.name}"`,
      userId: session.user.id,
    });

    return NextResponse.json({ message: "project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }
}
