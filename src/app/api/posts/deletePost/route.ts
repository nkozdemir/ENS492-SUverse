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
        
        // Delete a post
        const deletedPost = await prisma.post.delete({
            where: {
                id: postId,
                userId: userId,
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