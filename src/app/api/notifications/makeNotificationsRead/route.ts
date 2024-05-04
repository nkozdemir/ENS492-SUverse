import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// make multiple notifications (req body) read for the logged in user
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
        const { notifIds } = await req.json();
        console.log('NotifIds:', notifIds);

        // Make the selected notifications read for the logged in user
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notifIds,
                },
                notifiedId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Notifications marked as read',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}