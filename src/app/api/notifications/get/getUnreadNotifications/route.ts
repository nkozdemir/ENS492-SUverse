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
        const userId = session?.user?.id;

        // Get all unread notifications for the user
        const notifications = await prisma.notification.findMany({
            where: {
                notifiedId: userId,
                isRead: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // If no notifications found
        if (!notifications || notifications.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No notifications found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Unread notifications found',
            data: notifications,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}