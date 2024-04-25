import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// search users
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

        // get all users that contain the query in order which are not deleted
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { username: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                profilePic: true,
            },
            // order alphabetically
            orderBy: {
                name: 'asc',
            }, 
        });

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: users,
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