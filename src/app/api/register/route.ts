import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { date } from "yup";
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.SENDGRID_API_KEY
if(apiKey){
    sgMail.setApiKey(apiKey);
}

// Create a function to send verification email
async function sendVerificationEmail(userEmail: string, token: string) {
    const msg = {
        to: userEmail,
        from: 'sabanciuniverse@gmail.com', // Use the email address or domain you verified with your SendGrid account
        subject: 'SUVerse Email Verification',
        text: `Click on this link to verify your email: http://localhost:3000/verify/${token}`,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error(error);
    }
}

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
        if (!email.endsWith('@sabanciuniv.edu') && !email.endsWith('@alumni.sabanciuniv.edu')) {
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

        if(existingUser && existingUser.isVerified) {
            return NextResponse.json({
                status: 400,
                message: 'User already exists',
            });
        }

        // check if the user exists and it is created in the last 24 hours
        if (existingUser && !existingUser.isVerified && new Date().getTime() - existingUser.createdAt.getTime() < 86400000) {
            return NextResponse.json({
                status: 400,
                message: 'Pending verification. Please check your email.',
            });
        }

        // delete the user if it is created more than 24 hours ago and it is not verified
        if (existingUser && !existingUser.isVerified && new Date().getTime() - existingUser.createdAt.getTime() > 86400000) {
            await prisma.user.delete({
                where: {
                    email: email,
                },
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

        // Generate a unique token
        const token = uuidv4();

        // Save the verification token in your database
        await prisma.verificationToken.create({
            data: {
                userId: newUser.id,
                token: token,
                activatedAt: new Date(),
            },
        });

        // Send verification email
        await sendVerificationEmail(newUser.email, token);

        return NextResponse.json({
            status: 201,
            message: 'Registration successful, please verify your email.',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}