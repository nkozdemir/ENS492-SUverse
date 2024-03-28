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

        const id = req.nextUrl.searchParams.get('userId');
        const posts = await prisma.post.findMany({
            where: {
                userId: id,
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

        return NextResponse.json({
            status: 200,
            message: 'Posts found',
            data: posts,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}