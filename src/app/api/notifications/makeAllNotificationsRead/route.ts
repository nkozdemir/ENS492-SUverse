import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// make all notifications read for the logged in user
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

        // Make all notifications read for the logged in user
        await prisma.notification.updateMany({
            where: {
                notifiedId: userId,
                read: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}