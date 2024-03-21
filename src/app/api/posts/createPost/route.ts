import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// create post with logged in user id, category id, title, content, and attachments
export async function POST(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Post api session:", session);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;
        console.log("User id:", userId);
        const { categoryId, title, content, attachments } = await req.json();
        console.log({ categoryId, title, content, attachments });
        if (!userId || !categoryId || !title || !content) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }
        
        // Create a new post
        const newPost = await prisma.post.create({
            data: {
                userId,
                categoryId,
                title,
                content,
                attachments,
            },
        });

        return NextResponse.json({
            status: 201,
            message: 'Post created',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}