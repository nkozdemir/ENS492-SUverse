export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// Define a recursive function to delete comments
async function deleteCommentsRecursively(commentId: string) {
    // Find and delete all child comments of the current comment
    const childComments = await prisma.comment.findMany({
        where: {
            parentId: commentId,
        },
    });

    for (const childComment of childComments) {
        // Recursively delete child comments
        await deleteCommentsRecursively(childComment.id);
    }

    // Delete the current comment after its children are deleted
    await prisma.comment.delete({
        where: {
            id: commentId,
        },
    });

    // delete like notifications associated with the comment
    await prisma.notification.deleteMany({
        where: {
            commentId: commentId,
        },
    });
}

// delete post with logged in user id and post id
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
        //console.log("User id:", userId);
        const { postId } = await req.json();
        if (!postId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }
        
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (post.userId !== userId && user?.isAdmin !== true) {
            return NextResponse.json({
                status: 403,
                message: 'You are not authorized to delete this post',
            });
        }

        // Find and delete root-level comments associated with the post
        const rootComments = await prisma.comment.findMany({
            where: {
                postId: postId,
                parent: null, // Root-level comments have no parent
            },
        });

        // Recursively delete comments starting from root-level comments
        for (const rootComment of rootComments) {
            await deleteCommentsRecursively(rootComment.id);
        }

        // delete like notifications associated with the post
        await prisma.notification.deleteMany({
            where: {
                postId: postId,
            },
        });

        // After deleting comments, delete the post itself
        const deletedPost = await prisma.post.delete({
            where: {
                id: postId,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Post deleted',
            data: deletedPost,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}