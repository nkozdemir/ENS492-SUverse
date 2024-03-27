"use client";

import Toast from '@/components/toast';
import { useState, useEffect } from 'react';
import { Post } from '@/types/interfaces';
import PostCard from './postcard';
import { useSession } from 'next-auth/react';

interface PostListProps {
    apiUrl: string;
}

export default function PostList({ apiUrl }: PostListProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    const fetchAllPosts = async () => {
        try {
            const res = await fetch(apiUrl);

            const data = await res.json();
            //console.log('Fetch all posts response:', data);
            if (data.status == 200) {
                const postsData: Post[] = data.data;
                console.log('Fetched posts:', postsData);
                setPosts(postsData);
            }
            else {
                Toast('err', 'An error occurred.');
            }
        } catch (error) {
            console.error('Error during fetching all posts:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setLoading(false);
        }
    }

    const handleDeletePost = async (postId: Post["id"]) => {
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
                Toast('ok', 'Post deleted successfully.');
                fetchAllPosts();
            } else {
                Toast('err', 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Toast('err', 'Internal server error.');
        }
    };

    const handleLikePost = async (postId: Post["id"]) => {
        try {
            const res = await fetch(`/api/posts/createLike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            const data = await res.json();
            console.log("Like response:", data);
            if (data.status === 201) {
                Toast('ok', 'Post liked successfully.');
                fetchAllPosts();
            } else {
                Toast('err', 'Failed to like post.');
            }
        } catch (error) {
            console.error('Error liking post:', error);
            Toast('err', 'Internal server error.');
        }
    }
    
    useEffect(() => {
        fetchAllPosts();
    }, []);

    return (
        <>
            {loading ? (
                <div className='flex items-end justify-center'>
                    <span className="loading loading-bars loading-lg"></span>
                </div>
            ) : posts.length === 0 ? ( 
                <h1>No posts found.</h1>
            ) : (
                <div>
                    {posts.map((post: Post) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onDelete={() => handleDeletePost(post.id)}
                            onLike={() => handleLikePost(post.id)}
                            isOwner={session?.user?.id === post.userId}
                        />
                    ))}
                </div>
            )}
        </>
    );
}