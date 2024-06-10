"use client";

import UserProfilePicture from "@/components/userProfilePicture";
import { isValidHexId } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface PostLikeValues {
    userId: string;
    user: {
        name: string;
        username: string;
        profilePic: string;
    }
}

export default function PostLikes({ params }: { params: { id: string } }) {
    const [postLikes, setPostLikes] = useState<PostLikeValues[]>([]);
    const [loading, setLoading] = useState(true);

    if (!isValidHexId(params.id)) {
        notFound();
    }

    const fetchPostLikes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/posts/like/get?postId=${params.id}`);
            const data = await res.json();
            console.log('Post likes response:', data);
            if (data.status === 200)
                setPostLikes(data.data);
            else 
                setPostLikes([]);
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
            <h1 className="text-2xl font-bold mb-4 mt-2">Post Likes {postLikes.length > 0 ? `(${postLikes.length})` : null}</h1>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : !postLikes.length ? (
                <p>The list is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {postLikes.map(follow => (
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