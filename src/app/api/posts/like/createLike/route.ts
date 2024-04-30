import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Create a like with user and post id
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
        const { postId } = await req.json();
        if (!userId || !postId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // Check if the user has already liked the post
        const existingLike = await prisma.postLike.findFirst({
            where: {
                userId: userId,
                postId: postId,
            },
        });

        if (existingLike) {
            return NextResponse.json({
                status: 400,
                message: 'You have already liked this post',
            });
        }
        
        // Create a new like
        const newLike = await prisma.postLike.create({
            data: {
                user: { connect: { id: userId } },
                post: { connect: { id: postId } },
            },
        });

        // Update the post's like count
        await prisma.post.update({
            where: { id: postId },
            data: {
                likeCount: {
                    increment: 1 // Increment the like count by 1
                }
            }
        });

        // Create a notification for the post owner
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { user: true }, // Include the user who made the post
        });

        if (post && post.user.id !== userId) {
            await prisma.notification.create({
                data: {
                    notifier: { connect: { id: userId } }, // The user who liked the post
                    notified: { connect: { id: post.user.id } }, // The user who made the post
                    type: 'POSTLIKE',
                    post: { connect: { id: postId } },
                    isRead: false,
                },
            });
        }

        return NextResponse.json({
            status: 201,
            message: 'Like created',
            data: newLike,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}