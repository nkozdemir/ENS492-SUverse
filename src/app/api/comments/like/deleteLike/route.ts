export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// delete like with logged in user id and comment id
export async function DELETE(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;
        const commentId = req.nextUrl.searchParams.get('commentId');        
        if (!userId || !commentId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }
        
        // Delete the like
        const deletedLike = await prisma.commentLike.deleteMany({
            where: {
                userId: userId,
                commentId: commentId,
            },
        });

        // Decrement the comment's like count
        await prisma.comment.update({
            where: { id: commentId },
            data: {
                likeCount: {
                    decrement: 1 // Decrement the like count by 1
                }
            }
        });

        // delete like notification
        await prisma.notification.deleteMany({
            where: {
                notifierId: userId,
                type: 'COMMENTLIKE',
                commentId: commentId,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Like deleted',
            data: deletedLike,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}