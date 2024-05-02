import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// given an email check if the user is verified
export async function POST(req: any) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({
                status: 400,
                message: 'Email is required',
            });
        }

        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: { 
                email: email 
            },
        });

        if (!existingUser) {   
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            });
        }

        // delete the user if it is not verified and the account is older than 24 hours
        else if (!existingUser.isVerified && (Date.now() - existingUser.createdAt.getTime()) > 86400000) {
            await prisma.user.delete({
                where: {
                    id: existingUser.id,
                },
            });

            return NextResponse.json({
                status: 204,
                message: 'User account deleted due to inactivity.',
            }); 
        }

        return NextResponse.json({
            status: 200,
            message: 'User found',
            data: existingUser,
        });

    } catch (error) {
        console.error("Check Verification Error:", error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}