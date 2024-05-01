import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// verify new registered user
export async function POST(req: any) {
    try {
        const token = req.nextUrl.searchParams.get('token');
        console.log({ token });

        if (!token) {
            return NextResponse.json({
                status: 400,
                message: 'Token is required',
            });
        }

        // Check if the token exists
        const existingToken = await prisma.verificationToken.findUnique({
            where: { 
                token: token 
            },
        });

        if (!existingToken) {   
            return NextResponse.json({
                status: 400,
                message: 'Invalid token. Check your email inbox for the activation link.',
            });
        }      

        // Update user's status to 'active'
        const updatedUser = await prisma.user.update({
            where: { 
                id: existingToken.userId 
            },
            data: {
                isVerified: true,
            },
        });

        // Delete the token
        await prisma.verificationToken.delete({
            where: { 
                token: token 
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'User verified',
            data: updatedUser,
        });
    } catch (error) {
        console.error("Verify Error:", error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
        });
    }
}