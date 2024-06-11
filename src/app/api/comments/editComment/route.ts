import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// edit a comment
export async function PUT(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;
        const { commentId, content } = await req.json();
        if (!userId || !commentId || !content) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // Check if the comment exists
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return NextResponse.json({
                status: 404,
                message: 'Comment not found',
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        // Check if the user is the owner of the comment or an admin
        if (comment.userId !== userId && user?.isAdmin !== true) {
            return NextResponse.json({
                status: 403,
                message: 'You are not authorized to edit this comment',
            });
        }

        // Update the comment
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content: content,
                editedAt: new Date(),
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Comment updated',
            data: updatedComment,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}