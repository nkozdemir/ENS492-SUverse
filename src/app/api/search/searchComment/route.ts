import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// search comments
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const query = req.nextUrl.searchParams.get('query');
        if (!query) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }

        // get all comments that contain the query in order which are not deleted
        const comments = await prisma.comment.findMany({
            where: {
                content: { contains: query, mode: 'insensitive' },
                isDeleted: false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: comments,
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}