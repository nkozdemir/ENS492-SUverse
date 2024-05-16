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

        const postId = req.nextUrl.searchParams.get('postId');

        // Check if the post exists
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

        // Get all the likes for the post
        const postLikes = await prisma.postLike.findMany({
            where: {
                postId,
            },
            select: {
                userId: true,
                user: {
                    select: {
                        name: true,
                        username: true,
                        profilePic: true,
                    },
                },
            },
        });

        // If no likes are found
        if (!postLikes || postLikes.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No likes found',
            });
        }

        // Return the post likes
        return NextResponse.json({
            status: 200,
            message: 'Post likes found',
            data: postLikes,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}