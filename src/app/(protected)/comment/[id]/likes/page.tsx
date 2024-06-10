"use client";

import UserProfilePicture from "@/components/userProfilePicture";
import { isValidHexId } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface CommentLikeValues {
    userId: string;
    user: {
        username: string;
        name: string;
        profilePic: string;
    };
}

export default function CommentLikes({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [commentLikes, setCommentLikes] = useState<CommentLikeValues[]>([]);

    if (!isValidHexId(params.id)) {
        notFound();
    }

    const fetchPostLikes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/comments/like/get?commentId=${params.id}`);
            const data = await res.json();
            console.log('Comment likes response:', data);
            if (data.status === 200)
                setCommentLikes(data.data);
            else 
                setCommentLikes([]);
        } catch (error) {
            console.error('Error fetching post likes:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPostLikes();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 mt-2">Comment Likes {commentLikes.length > 0 ? `(${commentLikes.length})` : null}</h1>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : !commentLikes.length ? (
                <p>The list is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {commentLikes.map(follow => (
                            <div key={follow.userId} className="rounded-lg shadow-lg p-2 flex flex-wrap items-center justify-between lg:space-x-8 bg-base-200 space-x-1">
                                <Link href={`/user/${follow.userId}`} className="flex items-center space-x-4">
                                    <UserProfilePicture imageUrl={follow.user.profilePic} size={50} />
                                    <div>
                                        <p className="font-semibold">{follow.user.name}</p>
                                        <p>@{follow.user.username}</p>
                                    </div>
                                </Link>
                            </div>  
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}