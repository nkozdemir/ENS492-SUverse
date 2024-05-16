import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const commentId = req.nextUrl.searchParams.get('commentId');
        if (!commentId) {
            return NextResponse.json({
                status: 400,
                message: 'Bad Request',
            });
        }

        // Get the users who liked the comment
        const likes = await prisma.commentLike.findMany({
            where: {
                commentId: commentId,
            },
            select: {
                userId: true,
                user: {
                    select: {
                        username: true,
                        name: true,
                        profilePic: true,
                    },
                },
            }
        });

        // If no likes found, return 404
        if (!likes || likes.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No likes found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comment likes found',
            data: likes,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}