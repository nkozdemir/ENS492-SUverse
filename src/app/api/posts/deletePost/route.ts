import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// delete post with logged in user id and post id
export async function POST(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;
        console.log("User id:", userId);
        const { postId } = await req.json();
        if (!postId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }
        
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (post.userId !== userId && user?.isAdmin !== true) {
            return NextResponse.json({
                status: 403,
                message: 'You are not authorized to delete this post',
            });
        }

        const deletedPost = await prisma.post.delete({
            where: {
                id: postId,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Post deleted',
            data: deletedPost,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}