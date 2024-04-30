import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

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

        // Check if the user is trying to unfollow themselves
        if (loggedInUserId === userId) {
            return NextResponse.json({
                status: 400,
                message: 'You cannot unfollow yourself',
            });
        }

        // Check if the follower exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            });
        }

        // Check if the user is already following the follower
        const existingFollower = await prisma.follow.findFirst({
            where: {
                followerId: userId,
                followingId: loggedInUserId,
            },
        });

        if (!existingFollower) {
            return NextResponse.json({
                status: 400,
                message: 'You are not following this user',
            });
        }

        // Delete the follow
        await prisma.follow.delete({
            where: {
                id: existingFollower.id,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                followingCount: {
                    decrement: 1,
                },
            },
        });

        await prisma.user.update({
            where: { id: loggedInUserId },
            data: {
                followerCount: {
                    decrement: 1,
                },
            },
        });        

        return NextResponse.json({
            status: 200,
            message: 'Successfully removed follower',
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}