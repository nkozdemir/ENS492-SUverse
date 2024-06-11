import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// delete all notifications for the logged in user
export async function DELETE(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userId = session?.user?.id;

        // Delete all notifications for the logged in user
        await prisma.notification.deleteMany({
            where: {
                notifiedId: userId,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'All notifications deleted',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}