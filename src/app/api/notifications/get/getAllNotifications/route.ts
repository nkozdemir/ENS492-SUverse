import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// get all notifications for the logged in user
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

        // Get all notifications for the logged in user
        const notifications = await prisma.notification.findMany({
            where: {
                notifiedId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                notifier: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profilePic: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                    },
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                        parent: true,
                    },
                },
            },
        });

        return NextResponse.json({
            status: 200,
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