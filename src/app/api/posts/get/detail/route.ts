import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

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

        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
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
        });

        // If no posts are found
        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }

        const formattedPost = {
            id: post.id,
            userId: post.userId,
            postId: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt, 
            post: post 
        };

        return NextResponse.json({
            status: 200,
            message: 'Post found',
            data: formattedPost,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}