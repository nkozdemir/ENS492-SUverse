import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// get all user comments in a post
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const postId = req.nextUrl.searchParams.get('postId');
        const userId = session?.user?.id;
        const userComments = await prisma.comment.findMany({
            where: {
                userId: userId,
                postId: postId,
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
        if (userComments.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No comments found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comments found',
            data: userComments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}