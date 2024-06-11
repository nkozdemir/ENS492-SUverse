export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const currentUserId = session.user.id;
        const id = req.nextUrl.searchParams.get('postId');
        if (!id) {
            return NextResponse.json({
                status: 400,
                message: 'Post ID is required',
            });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        profilePic: true,
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

        // Check if current user has liked the post
        const postLike = await prisma.postLike.findFirst({
            where: {
                userId: currentUserId,
                postId: id,
            },
        });

        const userCommentLikes = await prisma.commentLike.findMany({
            where: {
                userId: currentUserId,
                commentId: {
                    in: post.comments.map(comment => comment.id),
                },
            },
            select: {
                commentId: true,
            },
        });
        
        // Check if the user has liked each comment
        const formattedComments = post.comments.map(comment => {
            const isLiked = userCommentLikes.some(like => like.commentId === comment.id);
            return {
                ...comment,
                isLiked: isLiked,
            };
        });

        const formattedPost = {
            id: post.id,
            userId: post.userId,
            postId: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt, 
            editedAt: post.editedAt,
            post: {
                ...post,
                isLiked: !!postLike,
            },
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