import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all comments of a user by user id as parameter
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const userId = req.nextUrl.searchParams.get('userId');
        const comments = await prisma.comment.findMany({
            where: {
                userId: userId,
                isDeleted: false,
            },
            include: {
                post: {
                    select: {
                        title: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        username: true,
                        profilePic: true,
                    },
                },
            },
        });

        // If user has not commented on any post
        if (!comments || comments.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No comments found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comments found',
            data: comments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}

