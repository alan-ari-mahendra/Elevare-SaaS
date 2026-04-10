import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { updates } = await req.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedTasks = await Promise.all(
      updates.map((task: { id: string; kanbanPosition: number; status: string }) =>
        prisma.task.updateMany({
          where: { id: task.id, userId: session.user.id },
          data: {
            kanbanPosition: task.kanbanPosition,
            status: task.status,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Tasks reordered successfully",
      data: updatedTasks,
    });
  } catch (error) {
    console.error("Error updating kanban order:", error);
    return NextResponse.json(
      { error: "Failed to reorder tasks" },
      { status: 500 }
    );
  }
}
