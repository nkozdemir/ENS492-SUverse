import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// delete like with logged in user id and post id
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
        const { postId } = await req.json();
        if (!userId || !postId) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }
        
        // Delete the like
        const deletedLike = await prisma.like.deleteMany({
            where: {
                userId: userId,
                postId: postId,
            },
        });

        // Decrement the post's like count
        await prisma.post.update({
            where: { id: postId },
            data: {
                likeCount: {
                    decrement: 1 // Decrement the like count by 1
                }
            }
        });

        return NextResponse.json({
            status: 200,
            message: 'Like deleted',
            data: deletedLike,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}