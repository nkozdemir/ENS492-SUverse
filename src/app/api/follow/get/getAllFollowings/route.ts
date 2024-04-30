import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

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

        // format followings data such that the following field becomes user
        followings.forEach(following => {
            following.user = following.following;
            delete following.following;
        });

        // Check if current user follows the user
        const isFollowing = await prisma.follow.findFirst({
            where: {
                followerId: session.user.id,
                followingId: userId,
            }
        });    

        // for each following, add isFollowing field
        followings.forEach(following => {
            following.user.isFollowing = !!isFollowing;
        });

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: followings,
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