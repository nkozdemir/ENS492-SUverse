import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Create a comment on a post
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
        const { postId, content, attachments, parentId } = await req.json();
        if (!userId || !postId || !content) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }
        
        // Create a new comment
        const newComment = await prisma.comment.create({
            data: {
                user: { connect: { id: userId } },
                post: { connect: { id: postId } },
                content: content,
                attachments: attachments || [], // Attachments are optional
                parent: parentId ? { connect: { id: parentId } } : undefined,
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profilePic: true,
                    },
                },
                content: true,
                createdAt: true,
                updatedAt: true,
                parentId: true,
                likeCount: true,
                postId: true,
            },
        });

        // increment commentCount in the post
        await prisma.post.update({
            where: { id: postId },
            data: {
                commentCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({
            status: 201,
            message: 'Comment created',
            data: newComment,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}
