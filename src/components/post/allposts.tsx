"use client";

import Toast from '@/components/toast';
import { useState, useEffect } from 'react';
import { Post } from '@/types/interfaces';
import PostCard from './postcard';
import { useSession } from 'next-auth/react';

export default function AllPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    console.log(session?.user?.id);

    const fetchAllPosts = async () => {
        try {
            const res = await fetch('/api/posts/getAllPosts');
            const data = await res.json();
            if (data.status == 200) {
                const postsData: Post[] = data.data;
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
            Toast('info', 'Deleting post...');
            const res = await fetch(`/api/posts/deletePost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            const data = await res.json();
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
                        />
                    ))}
                </div>
            )}
        </>
    );
}