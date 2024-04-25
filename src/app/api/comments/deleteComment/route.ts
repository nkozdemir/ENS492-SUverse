import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Function to recursively delete comment and its children
async function deleteCommentAndChildren(commentId: string, postId: string) {
    // Find all children comments of the given comment
    const childrenComments = await prisma.comment.findMany({
        where: {
            parentId: commentId,
        },
    });

    // Recursively delete each child comment and its children
    for (const childComment of childrenComments) {
        await deleteCommentAndChildren(childComment.id, postId);
    }

    // Delete the parent comment
    await prisma.comment.delete({
        where: {
            id: commentId,
        },
    });

    // Decrement commentCount in the post
    await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            commentCount: {
                decrement: 1,
            },
        },
    });
}

// delete a comment
export async function POST(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;
        const { commentId } = await req.json();
        if (!commentId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });

        if (!comment) {
            return NextResponse.json({
                status: 404,
                message: 'Comment not found',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (comment.userId !== userId && user?.isAdmin !== true) {
            return NextResponse.json({
                status: 403,
                message: 'You are not authorized to delete this comment',
            });
        }

        // If the user is an admin, delete the comment and all its children recursively
        if (user?.isAdmin === true) {
            await deleteCommentAndChildren(commentId, comment.postId);
        }
        
        else {
            // If the user is the owner of the comment, soft delete (make isDeleted true)
            await prisma.comment.update({
                where: {
                    id: commentId,
                },
                data: {
                    isDeleted: true,
                },
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comment deleted',
            data: null,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}