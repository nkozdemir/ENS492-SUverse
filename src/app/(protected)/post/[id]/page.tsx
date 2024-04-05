"use client";

import Toast from "@/components/toast";
import { fetchUserLikes } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { PostValues } from "@/types/interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { MdDeleteOutline, MdEdit } from "react-icons/md";

export default function Post({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<PostValues>({} as PostValues);
    const [userLikes, setUserLikes] = useState<PostValues[]>([]);
    const [liked, setLiked] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

    const fetchPostDetails = async () => {
        try {
            const res = await fetch(`/api/posts/get/detail?postId=${params.id}`);
            const data = await res.json();
            console.log('Post Details Response:', data);
            if (data.status === 200) {
                console.log('Post Details:', data.data);
                setPost(data.data);
                setIsOwner(data.data.userId === session?.user?.id);
                setLiked(userLikes.some((likedPost) => likedPost.postId === data.data.postId));
            } else {
                if (data.status === 404) Toast('err', 'Post not found');
                else Toast('err', 'Internal server error. Please try again.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`/api/posts/deletePost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: post.postId }),
            });

            const data = await res.json();
            console.log('Delete post response:', data);
            if (data.status === 200) {
                Toast('ok', 'Post deleted successfully.');
                // Redirect to previous page
                router.back();
            } else {
                Toast('err', 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Toast('err', 'Internal server error.');
        }
    };

    const handleLikePost = async () => {
        // If post is already liked, unlike it
        if (liked) {
            // Remove like locally, reduce post.post.likeCount by 1
            setLiked(false);
            setPost({ ...post, post: { ...post.post, likeCount: post.post.likeCount - 1 } });
            try {
                const res = await fetch(`/api/posts/like/deleteLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId: post.postId }),
                });

                const data = await res.json();
                console.log('Unlike post response:', data);
                if (data.status !== 200) Toast('err', 'Failed to unlike post.');
            } catch (error) {
                console.error('Error unliking post:', error);
                Toast('err', 'Internal server error.');
            }
        } else {
            // Add like locally, increase post.post.likeCount by 1
            setLiked(true);
            setPost({ ...post, post: { ...post.post, likeCount: post.post.likeCount + 1 } });
            try {
                const res = await fetch(`/api/posts/like/createLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId: post.postId }),
                });

                const data = await res.json();
                console.log('Like post response:', data);
                if (data.status !== 200) Toast('err', 'Failed to like post.');
            } catch (error) {
                console.error('Error liking post:', error);
                Toast('err', 'Internal server error.');
            }
        }
    };

    useEffect(() => {
        fetchPostDetails();
    }, [userLikes]);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchData = async () => {
                const data = await fetchUserLikes(session?.user?.id);
                setUserLikes(data);
            };
            fetchData();
        }
    }, [status]);

    return (
        <div className="container mx-auto mt-4">
            <h1 className="font-bold text-2xl mb-8">Post Details</h1>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-lg"></span>
                </div>
            ) : (
                <>
                    {/* Post Details */}
                    <div className="bg-base-200 p-6 mb-8 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">{post.post.title}</h2>
                        <p className="font-semibold mb-2">{post.post.user.name} (@{post.post.user.username})</p>
                        <p className="font-semibold">{post.post.category.name}</p>
                        <br />
                        <p>{post.post.content}</p>
                        <br />
                        <p>Created: {formatDate(new Date(post.post.createdAt))}</p>
                        <p>Updated: {formatDate(new Date(post.post.updatedAt))}</p>
                    </div>
    
                    {/* Post Actions */}
                    <div className="bg-base-200 rounded p-4 mb-8 flex items-center space-x-4">
                        <button
                            className="inline-flex items-center space-x-1 btn btn-ghost btn-circle"
                            onClick={handleLikePost}
                        >
                            {liked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                            <span>{post.post.likeCount}</span>
                        </button>
                        {isOwner && (
                            <>
                                <button className="inline-flex items-center space-x-1 btn btn-ghost btn-circle">
                                    <MdEdit size={20} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={handleDeletePost}
                                    className="inline-flex items-center space-x-1 btn btn-ghost btn-circle"
                                >
                                    <MdDeleteOutline size={20} />
                                    <span>Delete</span>
                                </button>
                            </>
                        )}
                    </div>
    
                    {/* Comments Section */}
                    <div className="bg-base-200 rounded p-6">
                        <h2 className="text-2xl font-semibold mb-4">Comments ({0})</h2>
                        <div>Comments will appear here</div>
                    </div>
                </>
            )}
        </div>
    ); 
}
