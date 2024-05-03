import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// search posts, comments, and users
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const query = req.nextUrl.searchParams.get('query');
        if (!query) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // search posts
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
                isDeleted: false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // search comments
        const comments = await prisma.comment.findMany({
            where: {
                content: { contains: query, mode: 'insensitive' },
                isDeleted: false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // search users
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { username: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                profilePic: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // search categories
        const categories = await prisma.category.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: {
                posts,
                comments,
                users,
                categories,
            },
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}