import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// get all posts from followed users from most recent to least recent as in a timeline
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const loggedInUserId = session?.user?.id;

        // Get all the users that the logged in user is following
        const following = await prisma.follow.findMany({
            where: {
                followerId: loggedInUserId,
            },
            select: {
                followingId: true,
            },
        });

        // Get all the posts from the users that the logged in user is following
        const posts = await prisma.post.findMany({
            where: {
                userId: {
                    in: following.map((follow) => follow.followingId),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: posts,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}