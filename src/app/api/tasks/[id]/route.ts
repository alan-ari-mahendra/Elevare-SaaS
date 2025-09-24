import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
        where: { id: params.id, userId: session.user.id },
    });

    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
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
    const { title, description, status, priority, dueDate, projectId } = body;

    const task = await prisma.task.updateMany({
        where: { id: params.id, userId: session.user.id },
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            projectId,
        },
    });

    if (task.count === 0) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updated = await prisma.task.findUnique({ where: { id: params.id } });
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

    const task = await prisma.task.deleteMany({
        where: { id: params.id, userId: session.user.id },
    });

    if (task.count === 0) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" });
}
