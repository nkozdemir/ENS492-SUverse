import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

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
        
        // format followers data such that the follower field becomes user
        followers.forEach(follower => {
            follower.user = follower.follower;
            delete follower.follower;
        });

        // Check if current user follows the user
        const isFollowing = await prisma.follow.findFirst({
            where: {
                followerId: session.user.id,
                followingId: userId,
            }
        });    

        // for each follower, add isFollowing field
        followers.forEach(follower => {
            follower.user.isFollowing = !!isFollowing;
        });

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: followers
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
