import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
}

export async function POST(req: Request) {
    try{
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, status, priority, dueDate, projectId } = body;

        if (!title || !projectId) {
            return NextResponse.json(
                { error: "Title & projectId wajib diisi" },
                { status: 400 }
            );
        }
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: session.user.id,
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found or unauthorized" },
                { status: 404 }
            );
        }
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status ?? "todo",
                priority: priority ?? "medium",
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId,
                userId: session.user.id,
            },
        });
        console.log("Created task:", task);
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/tasks:", error);

        // Return detailed error information
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
