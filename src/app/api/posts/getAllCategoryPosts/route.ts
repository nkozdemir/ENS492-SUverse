import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// get all posts of a category
export async function POST(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        
        const { categoryId } = await req.json();
        if (!categoryId) {
            return NextResponse.json({
                status: 400,
                message: 'Category id is required',
            });
        }
        
        // Get all posts of a category
        const posts = await prisma.post.findMany({
            where: {
                categoryId: categoryId
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // If no posts found
        if (!posts.length) {
            return NextResponse.json({
                status: 404,
                message: 'No posts found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'All posts of a category',
            data: posts,
        });

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}