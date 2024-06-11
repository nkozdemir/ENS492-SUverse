import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all followers of a user
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

        // get all followers of a user
        const followers = await prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profilePic: true,
                    },
                },
            },
        });

        // Check if current user follows each user in the followers list
        const currentUserId = session.user.id;
        const isFollowing = await prisma.follow.findMany({
            where: {
                followerId: currentUserId,
                followingId: {
                    in: followers.map(follow => follow.followerId),
                },
            },
            select: {
                followingId: true,
            },
        });
        
        // format the followers list such that each follower has a user object and isFollowing field inside the user object
        const formattedFollowers = followers.map(follower => ({
            id: follower.id,
            followerId: follower.followerId,
            followingId: follower.followingId,
            createdAt: follower.createdAt,
            updatedAt: follower.updatedAt,
            user: {
                ...follower.follower,
                isFollowing: isFollowing.some(follow => follow.followingId === follower.follower.id),
                isCurrentUser: follower.follower.id === currentUserId,
            },
        }));

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: formattedFollowers,
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
