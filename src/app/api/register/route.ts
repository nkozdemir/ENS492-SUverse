import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: any) {
    try {
        const { name, email, password, tag } = await req.json();
        console.log({ name, email, password, tag });
        if (!name || !email || !password || !tag) {
            return NextResponse.json({
                status: 400,
                message: 'All fields are required',
            });
        }
        
        // Validate email
        if (!email.endsWith('@sabanciuniv.edu')) {
            return NextResponse.json({
                status: 400,
                message: 'Invalid email',
            });
        }

        // Check if the user already exists (based on email)
        const existingUser = await prisma.user.findUnique({
            where: { 
                email: email 
            },
        });

        if (existingUser) {   
            return NextResponse.json({
                status: 400,
                message: 'User already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                username: email.split('@')[0],
                password: hashedPassword,
                tag,
            },
        });

        return NextResponse.json({
            status: 201,
            message: 'User registered',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}