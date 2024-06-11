import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all followings of a user
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        // get userId as a query parameter
        const userId = req.nextUrl.searchParams.get('userId');

        // get all followings of a user
        const followings = await prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profilePic: true,
                    },
                },
            },
        });

        // Check if current user follows each user in the followings list
        const currentUserId = session.user.id;
        const isFollowing = await prisma.follow.findMany({
            where: {
                followerId: currentUserId,
                followingId: {
                    in: followings.map(follow => follow.followingId),
                },
            },
            select: {
                followingId: true,
            },
        });

        // format the followers list such that each follower has a user object and isFollowing field inside the user object
        const formattedFollowings = followings.map(following => ({
            id: following.id,
            followerId: following.followerId,
            followingId: following.followingId,
            createdAt: following.createdAt,
            updatedAt: following.updatedAt,
            user: {
                ...following.following,
                isFollowing: isFollowing.some(follow => follow.followingId === following.following.id),
                isCurrentUser: following.following.id === session.user.id, 
            },
        }));

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: formattedFollowings,
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}