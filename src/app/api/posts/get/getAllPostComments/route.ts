import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// get all comments on a post
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
        const comments = await prisma.comment.findMany({
            where: {
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
                //parent: true, // Include parent comment information
                children: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                            }
                        }
                    }
                }, // Include children comments with user object
            },
            orderBy: {
                createdAt: 'asc', // Order comments by creation date in ascending order
            },
        });

        // If no comments are found
        if (comments.length === 0) {
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