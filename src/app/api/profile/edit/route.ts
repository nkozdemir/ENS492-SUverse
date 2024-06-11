import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/authoptions";

// Edit user profile
export async function PUT(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const loggedInUserId = session?.user?.id;
        const { userId, name, bio, profilePic, tag } = await req.json();
        // if (!userId || (!name && !profilePic && !bio && !tag)) {
        //     return NextResponse.json({
        //         status: 400,
        //         message: 'At least one field is required',
        //     });
        // }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            });
        }

        const loggedInUser = await prisma.user.findUnique({
            where: {
                id: loggedInUserId,
            },
        });

        // update if the user is the logged in user or an admin
        if (loggedInUserId !== userId && loggedInUser?.isAdmin !== true) {
            return NextResponse.json({
                status: 403,
                message: 'You are not authorized to edit this profile',
            });
        }

        // Create an empty object to hold the updated fields
        const updatedFields: Record<string, any> = {};

        // Check each field and add it to the updatedFields object if it's not empty
        if (name !== undefined && name !== '') {
            updatedFields.name = name;
        }
            updatedFields.bio = bio;
        
            updatedFields.profilePic = profilePic;
    
        if (tag !== undefined && tag !== '') {
            updatedFields.tag = tag;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updatedFields,
        });

        return NextResponse.json({
            status: 200,
            message: 'Profile updated',
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}