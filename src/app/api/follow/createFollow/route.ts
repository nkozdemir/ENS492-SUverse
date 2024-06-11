export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// create a follow
export async function POST(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const loggedInUserId = session?.user?.id;
        const userId = req.nextUrl.searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // Check if the user is trying to follow themselves
        if (loggedInUserId === userId) {
            return NextResponse.json({
                status: 400,
                message: 'You cannot follow yourself',
            });
        }

        // Check if the followee exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            });
        }

        // Check if the user is already following the followee
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: loggedInUserId,
                followingId: userId,
            },
        });

        if (existingFollow) {
            return NextResponse.json({
                status: 400,
                message: 'You are already following this user',
            });
        }

        // Create the follow
        const follow = await prisma.follow.create({
            data: {
                followerId: loggedInUserId,
                followingId: userId,
            },
        });

        // increment the followed user's followers count
        await prisma.user.update({
            where: { id: userId },
            data: {
                followerCount: {
                    increment: 1,
                },
            },
        });

        // increment the logged in user's following count
        await prisma.user.update({
            where: { id: loggedInUserId },
            data: {
                followingCount: {
                    increment: 1,
                },
            },
        });

        // Create a notification for the followed user
        await prisma.notification.create({
            data: {
                notifier: { connect: { id: loggedInUserId } },
                notified: { connect: { id: userId } },
                type: 'FOLLOW',
                isRead: false,
            },
        });

        return NextResponse.json({
            status: 201,
            message: 'Follow created',
            data: follow,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'An error occurred while creating the follow',
        });
    }
}