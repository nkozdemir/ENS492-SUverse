import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string };
                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: email 
                        }, 
                    });
                    if (!user) return null;

                    //console.log("User:", user);
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) return null;

                    return user;
                } catch (error) {
                    console.error("Authorize Error:", error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
      async jwt({ token, user, session, trigger }) {
        //console.log("JWT Callback:", { token, user, session });

        // Update token with user information
        if (trigger === "update" && session?.bio) {
            token.bio = session.bio;
            token.profilePic = session.profilePic;
        }

        // Pass information to the token
        if (user) {
            return {
                ...token,
                ...user,
            };
        }
        return token;
      },
      async session({ session, token, user }) {
        //console.log("Session Callback:", { session, token, user });
        
        // Pass information to the session
        return {
            ...session,
            user: {
                ...session.user,
                id: token.id,
                username: token.username,
                isAdmin: token.isAdmin,
                profilePic: token.profilePic,
                bio: token.bio,
            },
        };
      },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
};  

export default authOptions;