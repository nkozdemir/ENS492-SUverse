import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// get all direct comments on a post
export async function GET(req: any, res: any) {
    try {
        /*
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }
        */

        const postId = req.nextUrl.searchParams.get('postId');
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
                parent: null, // Get only direct comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                },
                //parent: true, // Include parent comment information
                children: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                            }
                        }
                    }
                }, // Include children comments with user object
            },
            orderBy: {
                createdAt: 'asc', // Order comments by creation date in ascending order
            },
        });

        // If no comments are found
        if (comments.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No comments found',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Comments found',
            data: comments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}

/*
// Recursive function to fetch all children of a comment
async function fetchChildren(commentId: string) {
    const comments = await prisma.comment.findMany({
        where: {
            parentId: commentId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                }
            },
            children: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        }
                    }
                }
            }
        }
    });

    const children: any[] = [];
    for (const comment of comments) {
        const childComments = await fetchChildren(comment.id);
        children.push({
            ...comment,
            children: childComments
        });
    }

    return children;
}

// get all direct comments on a post
export async function GET(req: any, res: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
        }

        const postId = req.nextUrl.searchParams.get('postId');
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
                parent: null, // Get only direct comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                },
                children: true // Include children comments
            },
            orderBy: {
                createdAt: 'asc', // Order comments by creation date in ascending order
            },
        });

        // If no comments are found
        if (comments.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No comments found',
            });
        }

        // Fetch all children recursively
        for (const comment of comments) {
            comment.children = await fetchChildren(comment.id);
        }

        return NextResponse.json({
            status: 200,
            message: 'Comments found',
            data: comments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error. Please try again.',
        });
    }
}
*/