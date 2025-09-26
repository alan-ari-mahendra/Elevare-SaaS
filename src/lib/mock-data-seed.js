"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var user, projects, tasks, activities;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Starting database seeding...');
                    // Clear existing data in correct order (respecting foreign key constraints)
                    return [4 /*yield*/, prisma.activity.deleteMany()];
                case 1:
                    // Clear existing data in correct order (respecting foreign key constraints)
                    _a.sent();
                    return [4 /*yield*/, prisma.task.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.project.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 4:
                    _a.sent();
                    console.log('🧹 Cleared existing data');
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                id: "user-1",
                                name: "John Doe",
                                email: "john@example.com",
                                avatarUrl: "/professional-headshot.png",
                            },
                        })];
                case 5:
                    user = _a.sent();
                    console.log('👤 Created user:', user.name);
                    return [4 /*yield*/, Promise.all([
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
                        ])];
                case 6:
                    projects = _a.sent();
                    console.log('📁 Created', projects.length, 'projects');
                    return [4 /*yield*/, Promise.all([
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
                        ])];
                case 7:
                    tasks = _a.sent();
                    console.log('✅ Created', tasks.length, 'tasks');
                    return [4 /*yield*/, Promise.all([
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
                        ])];
                case 8:
                    activities = _a.sent();
                    console.log('📊 Created', activities.length, 'activities');
                    console.log('🎉 Database seeding completed successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
