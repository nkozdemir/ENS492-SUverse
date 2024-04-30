import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// make one notification (req body) read for the logged in user
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
        const { notifId } = req.body;

        // Make the notification read for the logged in user
        await prisma.notification.updateMany({
            where: {
                id: notifId,
                notifiedId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Notification marked as read',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}