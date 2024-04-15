import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// create like for comment
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
        const { commentId } = await req.json();
        if (!userId || !commentId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // check if the user has already liked the comment
        const existingLike = await prisma.commentLike.findFirst({
            where: {
                userId: userId,
                commentId: commentId,
            },
        });

        if (existingLike) {
            return NextResponse.json({
                status: 400,
                message: 'You have already liked this comment',
            });
        }
        
        // Create the like
        const newLike = await prisma.commentLike.create({
            data: {
                user: { connect: { id: userId } },
                comment: { connect: { id: commentId } },
            },
        });

        // Increment the comment's like count
        await prisma.comment.update({
            where: { id: commentId },
            data: {
                likeCount: {
                    increment: 1 // Increment the like count by 1
                }
            }
        });

        return NextResponse.json({
            status: 201,
            message: 'Like created',
            data: newLike,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}