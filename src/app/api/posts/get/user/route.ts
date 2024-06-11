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

        const currentUserId = session.user.id; // Assuming the user ID is stored in session
        const userId = req.nextUrl.searchParams.get('userId'); // Get the user ID from the query parameter
        if (!userId) {
            return NextResponse.json({
                status: 400,
                message: 'User ID is required',
            });
        }

        const posts = await prisma.post.findMany({
            where: {
                userId: userId,
                isDeleted: false,
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
            },
        });

        // If user has not created any post
        if (!posts || posts.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No posts found',
            });
        }

        const postLikes = await prisma.postLike.findMany({
            where: {
                userId: currentUserId,
                postId: {
                    in: posts.map(post => post.id),
                },
            },
            select: {
                postId: true,
            },
        });

        const likedPostIds = postLikes.map(like => like.postId);

        const formattedPosts = posts.map(post => ({
            id: post.id,
            userId: post.userId,
            postId: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            post: {
                ...post,
                isLiked: likedPostIds.includes(post.id),
            }
        }));

        return NextResponse.json({
            status: 200,
            message: 'Posts found',
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
