/* 
TODO:
- Add sorting mechanism for posts by date, likes.
*/

"use client";

import Toast from '@/components/toast';
import { useState, useEffect } from 'react';
import { PostDetailValues, PostValues } from '@/types/interfaces';
import PostCard from './postcard';

interface PostListProps {
    postData: PostValues[];
}

export default function PostList({ postData }: PostListProps) {
    const [posts, setPosts] = useState<PostValues[]>([]);

    const handleLike = async (post: PostDetailValues) => {
        const postId = post.id;
        // If the post is already liked, unlike it. Else, like it.
        if (post.isLiked) {
            post.isLiked = false;
            // Decrease likeCount of the post by 1
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
            post.isLiked = true;
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

    return (
        <>
            {posts.length === 0 ? ( 
                <h1>No posts found.</h1>
            ) : (
                <div>
                    {posts.map(({ post }) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onLike={() => handleLike(post)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}