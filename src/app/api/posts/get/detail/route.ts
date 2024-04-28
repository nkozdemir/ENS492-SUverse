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

        const id = req.nextUrl.searchParams.get('postId');

        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
                comments: {
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
                        editedAt: true,
                        parentId: true,
                        likeCount: true,
                        postId: true,
                        isDeleted: true,
                    }
                },
            },
        });

        // If no posts are found
        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }


        // Fetch user's comment likes
        const userCommentLikes = await prisma.commentLike.findMany({
            where: {
                userId: id,
                commentId: {
                    in: post.comments.map(comment => comment.id),
                },
            },
            select: {
                commentId: true,
            },
        });

        // Check if the user has liked each comment
        const formattedComments = post.comments.map(comment => ({
            ...comment,
            isLiked: userCommentLikes.some(like => like.commentId === comment.id)
        }));

        const formattedPost = {
            id: post.id,
            userId: post.userId,
            postId: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt, 
            editedAt: post.editedAt,
            post: post,
            comments: formattedComments, // Use formattedComments instead of post.comments
        };

        return NextResponse.json({
            status: 200,
            message: 'Post found',
            data: formattedPost,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}