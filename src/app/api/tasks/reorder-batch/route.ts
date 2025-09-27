import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { updates } = body;

        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json(
                { error: "Updates array is required" },
                { status: 400 }
            );
        }

        const results = await prisma.$transaction(
            updates.map((update: { taskId: string; newPosition: number; projectId: string }) =>
                prisma.task.update({
                    where: {
                        id: update.taskId,
                        userId: session.user.id,
                    },
                    data: {
                        position: update.newPosition,
                    },
                })
            )
        );

        return NextResponse.json({ success: true, updated: results.length });
    } catch (error) {
        console.error("Error in PUT /api/tasks/reorder-batch:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}