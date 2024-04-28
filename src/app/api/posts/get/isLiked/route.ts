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

        const id = req.nextUrl.searchParams.get('postId');
        if (!id) {
            return NextResponse.json({
                status: 400,
                message: 'Post ID is required',
            });
        }

        // Check if post with ID exists
        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
        });
        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }

        // Check if user has liked the post
        const userLikes = await prisma.postLike.findFirst({
            where: {
                userId: session.user.id,
                postId: id,
            },
        });

        if (userLikes) {
            return NextResponse.json({
                status: 200,
                data: {
                    isLiked: true,
                },
            });
        } else {
            return NextResponse.json({
                status: 200,
                data: {
                    isLiked: false,
                },
            });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}