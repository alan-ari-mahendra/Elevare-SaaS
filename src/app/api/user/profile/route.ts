import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const user = await prisma.user.findUnique({
            where: {id: session.user.id},
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                bio: true,
                location: true,
                website: true,
                company: true,
                timezone: true,
                language: true,
                updatedAt: true,
            },
        });
        console.log("User from api:", user);
        if (!user) {
            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            );
        }

        return NextResponse.json({
            user,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const body = await req.json();
        const {name, bio, location, website, company, timezone, language} = body;

        if (website && website.trim() !== "") {
            try {
                new URL(website);
            } catch {
                return NextResponse.json(
                    {error: "Invalid website URL"},
                    {status: 400}
                );
            }
        }

        const updatedUser = await prisma.user.update({
            where: {id: session.user.id},
            data: {
                name: name?.trim() || null,
                bio: bio?.trim() || null,
                location: location?.trim() || null,
                website: website?.trim() || null,
                company: company?.trim() || null,
                timezone: timezone || "America/Los_Angeles",
                language: language || "en",
                updatedAt: new Date(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                bio: true,
                location: true,
                website: true,
                company: true,
                timezone: true,
                language: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}