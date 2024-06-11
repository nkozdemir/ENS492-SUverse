import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all comments liked by a user by user id as parameter
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const userId = req.nextUrl.searchParams.get('userId');
        const likes = await prisma.commentLike.findMany({
            where: {
                userId: userId,
                comment: {
                    isDeleted: false,
                },
            },
            include: {
                comment: {
                    include: {
                        post: {
                            select: {
                                title: true,
                                content: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                        },
                        user: {
                            select: {
                                name: true,
                                username: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
        });

        // If user has not liked any comment
        if (!likes || likes.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No liked comments found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Liked comments found',
            data: likes,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}