export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all comments liked by the logged in user in a post
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const postId = req.nextUrl.searchParams.get('postId');
        const userId = session?.user?.id;
        const likedComments = await prisma.commentLike.findMany({
            where: {
                userId: userId,
                comment: {
                    post: {
                        id: postId,
                    },
                },
            },
            include: {
                comment: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                profilePic: true,
                            }
                        },
                    },
                },
            },
        });

        // If no comments are found
        if (likedComments.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No comments found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comments found',
            data: likedComments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}