import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const id = req.nextUrl.searchParams.get('commentId');
        if (!id) {
            return NextResponse.json({
                status: 400,
                message: 'Comment ID is required',
            });
        }

        // Check if comment exists
        const comment = await prisma.comment.findUnique({
            where: {
                id: id,
            },
        });
        if (!comment) {
            return NextResponse.json({
                status: 404,
                message: 'Comment not found',
            });
        }

        // Check if user has liked the comment
        const isLiked = await prisma.commentLike.findFirst({
            where: {
                commentId: id,
                userId: session.user.id,
            },
        });

        if (isLiked) {
            return NextResponse.json({
                status: 200,
                data: {
                    isLiked: true,
                },
            });
        } else {
            return NextResponse.json({
                status: 200,
                data: {
                    isLiked: false,
                },
            });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}