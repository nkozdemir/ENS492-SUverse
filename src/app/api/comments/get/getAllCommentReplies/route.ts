import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// get all comment replies on a comment
export async function GET(req: any, res: any) {
    try {
        /*
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        */

        const commentId = req.nextUrl.searchParams.get('commentId');
        const commentReplies = await prisma.comment.findMany({
            where: {
                parentId: commentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'asc', // Order comments by creation date in ascending order
            },
        });

        // If no comments are found
        if (commentReplies.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No comment replies found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comment replies found',
            data: commentReplies,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}