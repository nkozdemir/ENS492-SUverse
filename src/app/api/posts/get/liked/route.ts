import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const id = req.nextUrl.searchParams.get('userId');
        const likes = await prisma.like.findMany({
            where: {
                userId: id,
            },
            include: {
                post: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                username: true,
                            },
                        },
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        // If user has not liked any post
        if (!likes || likes.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No liked posts found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Liked posts found',
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