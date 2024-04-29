import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// delete a follow
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
                message: 'You cannot unfollow yourself',
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

        if (!existingFollow) {
            return NextResponse.json({
                status: 400,
                message: 'You are not following this user',
            });
        }

        // Delete the follow
        await prisma.follow.delete({
            where: {
                id: existingFollow.id,
            },
        });

        // decrement the logged in user's following count
        await prisma.user.update({
            where: {
                id: loggedInUserId,
            },
            data: {
                followingCount: {
                    decrement: 1,
                },
            },
        });

        // decrement the followed user's followers count
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                followerCount: {
                    decrement: 1,
                },
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Follow deleted',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}