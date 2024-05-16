import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// edit a post
export async function PUT(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;
        const { postId, title, content, attachment } = await req.json();
        if (!userId || !postId || !title || !content) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({
                status: 404,
                message: 'Post not found',
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        // Check if the user is the owner of the post or an admin
        if (post.userId !== userId && user?.isAdmin !== true) {
            return NextResponse.json({
                status: 403,
                message: 'You are not authorized to edit this post',
            });
        }

        // Update the post
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title: title,
                content: content,
                attachment: attachment,
                editedAt: new Date(),
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Post updated',
            data: updatedPost,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}