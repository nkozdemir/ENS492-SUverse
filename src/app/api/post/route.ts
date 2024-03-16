import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// create post with the user id, category id, title, content, and attachments
export async function POST(req: any) {
    try {
        const { userId, categoryId, title, content, attachments } = await req.json();
        console.log({ userId, categoryId, title, content, attachments });
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