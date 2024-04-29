import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const currentUserId = session.user.id;
        const userId = req.nextUrl.searchParams.get('userId');
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        // If user not found
        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            });
        }

        // Check if current user follows the user
        const isFollowing = await prisma.follow.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId,
            }
        });

        return NextResponse.json({
            status: 200,
            message: 'User found',
            data: {
                ...user,
                isFollowing: !!isFollowing,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}