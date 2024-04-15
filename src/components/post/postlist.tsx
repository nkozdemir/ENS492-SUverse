/* 
TODO:
- Add sorting mechanism for posts by date, likes.
*/

"use client";

import Toast from '@/components/toast';
import { useState, useEffect } from 'react';
import { PostValues } from '@/types/interfaces';
import PostCard from './postcard';
import { useSession } from 'next-auth/react';
import { fetchUserLikes } from '@/lib/api';

interface PostListProps {
    postData: PostValues[];
}

export default function PostList({ postData }: PostListProps) {
    const [posts, setPosts] = useState<PostValues[]>([]);
    const [userLikes, setUserLikes] = useState<PostValues[]>([]); 
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    const handleDeletePost = async (postId: PostValues["id"]) => {
        try {
            const res = await fetch(`/api/posts/deletePost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            const data = await res.json();
            console.log('Delete post response:', data);
            if (data.status === 200) {
                // Delete the post locally
                setPosts(prevPosts => prevPosts.filter((post) => post.id !== postId));
                Toast('ok', 'Post deleted successfully.');
            } else {
                Toast('err', 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Toast('err', 'Internal server error.');
        }
    };

    const handleLike = async (postId: PostValues["id"]) => {
        // If the post is already liked, unlike it. Else, like it.
        if (userLikes.some((likedPost) => likedPost.postId === postId)) {
            // Unlike the post locally
            setUserLikes(prevUserLikes => prevUserLikes.filter((likedPost) => likedPost.postId !== postId));
            // Reduce likeCount of the post by 1
            setPosts(prevPosts => prevPosts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        post: {
                            ...post.post,
                            likeCount: post.post.likeCount - 1,
                        },
                    };
                }
                return post;
            }));
            try {
                const res = await fetch(`/api/posts/like/deleteLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                });

                const data = await res.json();
                console.log("Unlike response:", data);
                if (data.status !== 200) {
                    Toast('err', 'Failed to unlike post.');
                }
            } catch (error) {
                console.error('Error unliking post:', error);
                Toast('err', 'Internal server error.');
            }
        } else {
            // Like the post locally
            const likedPost: PostValues = {
                id: '', 
                userId: '', 
                postId: postId,
                post: {
                    id: '',
                    userId: '',
                    categoryId: '',
                    title: '',
                    content: '',
                    attachments: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    likeCount: 0,
                    commentCount: 0,
                    isDeleted: false,
                    user: {
                        id: '',
                        name: '',
                        username: '',
                        email: '',
                        password: '',
                        profilePic: null,
                        followers: [],
                        following: [],
                        bio: null,
                        tag: '',
                        createdAt: null,
                        updatedAt: null,
                        isAdmin: false,
                    },
                    category: {
                        id: '',
                        name: ''
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setUserLikes(prevUserLikes => [...prevUserLikes, likedPost]);
            // Increase likeCount of the post by 1
            setPosts(prevPosts => prevPosts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        post: {
                            ...post.post,
                            likeCount: post.post.likeCount + 1,
                        },
                    };
                }
                return post;
            }));
            try {
                const res = await fetch(`/api/posts/like/createLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                });

                const data = await res.json();
                console.log("Like response:", data);
                if (data.status !== 201) {
                    Toast('err', 'Failed to like post.');
                }
            } catch (error) {
                console.error('Error liking post:', error);
                Toast('err', 'Internal server error.');
            }
        }
    }

    useEffect(() => {
        setPosts(postData);
    }, [postData]);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchData = async () => {
                const data = await fetchUserLikes(session?.user?.id);
                setUserLikes(data);
                setLoading(false);
            };
            fetchData();
        }
    }, [status]);

    return (
        <>
            {loading ? (
                <div className='flex items-center justify-center'>
                    <span className="loading loading-lg"></span>
                </div>
            ) : posts.length === 0 ? ( 
                <h1>No posts found.</h1>
            ) : (
                <div>
                    {posts.map(({ post }) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onDelete={() => handleDeletePost(post.id)}
                            onLike={() => handleLike(post.id)}
                            isOwner={session?.user?.id === post.userId}
                            liked={userLikes.some((likedPost) => likedPost.postId === post.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}