import prisma from "@/lib/db";
import authOptions from "@/utils/authoptions";
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

        const currentUserId = session.user.id;
        const id = req.nextUrl.searchParams.get('userId');
        if (!id) {
            return NextResponse.json({
                status: 400,
                message: 'User ID is required',
            });
        }

        const likes = await prisma.postLike.findMany({
            where: {
                userId: id,
            },
            include: {
                post: {
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
                    },
                },
            },
        });

        // If user has not liked any post
        if (!likes || likes.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No liked posts found',
            });
        }

        // Get post IDs that the current user has liked
        const postLikes = await prisma.postLike.findMany({
            where: {
                userId: currentUserId,
                postId: {
                    in: likes.map(like => like.postId),
                },
            },
            select: {
                postId: true,
            },
        });

        // Get the post IDs
        const likedPostIds = postLikes.map(like => like.postId);

        const formattedPosts = likes.map(post => ({
            id: post.id,
            userId: post.userId,
            postId: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            post: {
                ...post.post,
                // Check if the current user has liked the post
                isLiked: likedPostIds.includes(post.post.id),
            }
        }));

        return NextResponse.json({
            status: 200,
            message: 'Liked posts found',
            data: formattedPosts,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}