import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// get all posts
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const posts = await prisma.post.findMany({
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
        if (!posts || posts.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No posts found',
            });
        }

        const formattedPosts = posts.map(({ ...post }) => ({
            id: post.id,
            userId: post.userId,
            postId: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt, 
            post: post 
        }));
        //console.log('getAllPosts:', formattedPosts);

        return NextResponse.json({
            status: 200,
            message: 'Posts found',
            data: formattedPosts,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}