import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Clear existing data in correct order (respecting foreign key constraints)
    await prisma.activity.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Cleared existing data')
    const hashedPassword = await bcrypt.hash("password", 10)
    // Create User
    const user = await prisma.user.create({
        data: {
            id: "user-1",
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword,
            avatarUrl: "/professional-headshot.png",
        },
    })

    console.log('👤 Created user:', user.name)

    // Create Projects
    const projects = await Promise.all([
        prisma.project.create({
            data: {
                id: "project-1",
                name: "Website Redesign",
                description: "Complete overhaul of the company website with modern design and improved UX",
                status: "in_progress",
                color: "#6366F1",
                endDate: new Date("2024-02-28T23:59:59Z"),
                userId: user.id,
                createdAt: new Date("2024-01-15T10:00:00Z"),
                updatedAt: new Date("2024-01-20T14:30:00Z"),
            },
        }),
        prisma.project.create({
            data: {
                id: "project-2",
                name: "Mobile App Development",
                description: "Native iOS and Android app for customer engagement",
                status: "planning",
                color: "#10B981",
                endDate: new Date("2024-04-15T23:59:59Z"),
                userId: user.id,
                createdAt: new Date("2024-01-10T09:00:00Z"),
                updatedAt: new Date("2024-01-18T16:45:00Z"),
            },
        }),
        prisma.project.create({
            data: {
                id: "project-3",
                name: "Marketing Campaign Q1",
                description: "Launch comprehensive marketing campaign for Q1 2024",
                status: "completed",
                color: "#F59E0B",
                endDate: new Date("2024-01-31T23:59:59Z"),
                userId: user.id,
                createdAt: new Date("2023-12-01T08:00:00Z"),
                updatedAt: new Date("2024-01-05T12:00:00Z"),
            },
        }),
        prisma.project.create({
            data: {
                id: "project-4",
                name: "Database Migration",
                description: "Migrate legacy database to new cloud infrastructure",
                status: "archived",
                color: "#6B7280",
                endDate: new Date("2023-12-31T23:59:59Z"),
                userId: user.id,
                createdAt: new Date("2023-11-15T10:00:00Z"),
                updatedAt: new Date("2023-12-20T15:30:00Z"),
            },
        }),
    ])

    console.log('📁 Created', projects.length, 'projects')

    // Create Tasks
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                id: "task-1",
                title: "Design homepage mockups",
                description: "Create wireframes and high-fidelity mockups for the new homepage",
                status: "done",
                priority: "high",
                dueDate: new Date("2024-01-25T17:00:00Z"),
                position: 1,
                projectId: "project-1",
                userId: user.id,
                createdAt: new Date("2024-01-15T10:00:00Z"),
                updatedAt: new Date("2024-01-22T14:30:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-2",
                title: "Implement responsive navigation",
                description: "Build mobile-first navigation component with accessibility features",
                status: "in_progress",
                priority: "high",
                dueDate: new Date("2024-01-30T17:00:00Z"),
                position: 2,
                projectId: "project-1",
                userId: user.id,
                createdAt: new Date("2024-01-16T11:00:00Z"),
                updatedAt: new Date("2024-01-20T09:15:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-3",
                title: "Content audit and migration",
                description: "Review existing content and migrate to new CMS",
                status: "todo",
                priority: "medium",
                dueDate: new Date("2024-02-05T17:00:00Z"),
                position: 3,
                projectId: "project-1",
                userId: user.id,
                createdAt: new Date("2024-01-17T13:00:00Z"),
                updatedAt: new Date("2024-01-17T13:00:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-4",
                title: "Research native development frameworks",
                description: "Compare React Native, Flutter, and native development approaches",
                status: "in_progress",
                priority: "high",
                dueDate: new Date("2024-01-28T17:00:00Z"),
                position: 1,
                projectId: "project-2",
                userId: user.id,
                createdAt: new Date("2024-01-10T09:00:00Z"),
                updatedAt: new Date("2024-01-18T16:45:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-5",
                title: "Define app architecture",
                description: "Create technical specification and architecture diagrams",
                status: "todo",
                priority: "high",
                dueDate: new Date("2024-02-02T17:00:00Z"),
                position: 2,
                projectId: "project-2",
                userId: user.id,
                createdAt: new Date("2024-01-12T10:30:00Z"),
                updatedAt: new Date("2024-01-12T10:30:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-6",
                title: "Setup development environment",
                description: "Configure development tools and CI/CD pipeline",
                status: "todo",
                priority: "medium",
                dueDate: new Date("2024-02-10T17:00:00Z"),
                position: 3,
                projectId: "project-2",
                userId: user.id,
                createdAt: new Date("2024-01-14T14:00:00Z"),
                updatedAt: new Date("2024-01-14T14:00:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-7",
                title: "Performance optimization",
                description: "Optimize website loading times and Core Web Vitals",
                status: "todo",
                priority: "low",
                dueDate: new Date("2024-02-15T17:00:00Z"),
                position: 4,
                projectId: "project-1",
                userId: user.id,
                createdAt: new Date("2024-01-19T15:30:00Z"),
                updatedAt: new Date("2024-01-19T15:30:00Z"),
            },
        }),
        prisma.task.create({
            data: {
                id: "task-8",
                title: "User testing sessions",
                description: "Conduct usability testing with target users",
                status: "todo",
                priority: "medium",
                dueDate: new Date("2024-02-20T17:00:00Z"),
                position: 5,
                projectId: "project-1",
                userId: user.id,
                createdAt: new Date("2024-01-20T11:00:00Z"),
                updatedAt: new Date("2024-01-20T11:00:00Z"),
            },
        }),
    ])

    console.log('✅ Created', tasks.length, 'tasks')

    // Create Activities
    const activities = await Promise.all([
        prisma.activity.create({
            data: {
                id: "activity-1",
                action: "created_project",
                details: 'Created project "Website Redesign"',
                userId: user.id,
                projectId: "project-1",
                createdAt: new Date("2024-01-15T10:00:00Z"),
            },
        }),
        prisma.activity.create({
            data: {
                id: "activity-2",
                action: "completed_task",
                details: 'Completed task "Design homepage mockups"',
                userId: user.id,
                projectId: "project-1",
                taskId: "task-1",
                createdAt: new Date("2024-01-22T14:30:00Z"),
            },
        }),
        prisma.activity.create({
            data: {
                id: "activity-3",
                action: "updated_task",
                details: 'Updated task "Implement responsive navigation" status to in progress',
                userId: user.id,
                projectId: "project-1",
                taskId: "task-2",
                createdAt: new Date("2024-01-20T09:15:00Z"),
            },
        }),
        prisma.activity.create({
            data: {
                id: "activity-4",
                action: "created_task",
                details: 'Created task "User testing sessions"',
                userId: user.id,
                projectId: "project-1",
                taskId: "task-8",
                createdAt: new Date("2024-01-20T11:00:00Z"),
            },
        }),
        prisma.activity.create({
            data: {
                id: "activity-5",
                action: "completed_project",
                details: 'Completed project "Marketing Campaign Q1"',
                userId: user.id,
                projectId: "project-3",
                createdAt: new Date("2024-01-05T12:00:00Z"),
            },
        }),
    ])

    console.log('📊 Created', activities.length, 'activities')

    console.log('🎉 Database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })