import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all categories
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const categories = await prisma.category.findMany();
        if (!categories || categories.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No categories found',
            });
        }
        
        categories.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({
            status: 200,
            message: 'Categories found',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}
