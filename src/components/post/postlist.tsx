/* 
TODO:
- Add sorting mechanism for posts by date, likes.
- Separate fetching all posts from this component, pass fetched posts as props.
*/

"use client";

import Toast from '@/components/toast';
import { useState, useEffect } from 'react';
import { PostValues, LikeValues } from '@/types/interfaces';
import PostCard from './postcard';
import { useSession } from 'next-auth/react';

interface PostListProps {
    apiEndpoint: string;
    requestOptions?: RequestInit;
}

export default function PostList({ apiEndpoint, requestOptions }: PostListProps) {
    const [posts, setPosts] = useState<PostValues[]>([]);
    const [likedPosts, setLikedPosts] = useState<LikeValues[]>([]); 
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    const fetchAllPosts = async () => {
        try {
            const res = await fetch(apiEndpoint, requestOptions);

            const data = await res.json();
            //console.log('Fetch all posts response:', data);
            if (data.status == 200) {
                const postsData: PostValues[] = data.data.reverse();
                console.log('Fetched posts:', postsData);
                setPosts(postsData);
                await fetchLikedPosts();
            } else if (data.status == 404) {
                setPosts([]);
            } else {
                Toast('err', 'An error occurred.');
            }
        } catch (error) {
            console.error('Error during fetching all posts:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setLoading(false);
        }
    }

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
        if (likedPosts.some((likedPost) => likedPost.postId === postId)) {
            // Unlike the post locally
            setLikedPosts(prevLikedPosts => prevLikedPosts.filter((likedPost) => likedPost.postId !== postId));
            // Reduce likeCount of the post by 1
            setPosts(prevPosts => prevPosts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likeCount: post.likeCount - 1,
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
            const likedPost: LikeValues = {
                id: '', // Fill in with appropriate value
                userId: '', // Fill in with appropriate value
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
                    likeCount: 0
                }
            };
            setLikedPosts(prevLikedPosts => [...prevLikedPosts, likedPost]);
            // Increase likeCount of the post by 1
            setPosts(prevPosts => prevPosts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likeCount: post.likeCount + 1,
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


    const fetchLikedPosts = async () => {
        try {
            const res = await fetch(`/api/posts/get/liked?userId=${session?.user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log('Fetch liked posts response:', data);
            if (data.status === 200) {
                const likedPosts = data.data;
                //console.log('Liked posts:', likedPosts);
                setLikedPosts(likedPosts);
            } else if (data.status === 404) {
                setLikedPosts([]);
            } else {
                Toast('err', 'An error occurred.');
            }
        } catch (error) {
            console.error('Error during fetching liked posts:', error);
            Toast('err', 'Internal server error.');
        }
    }

    useEffect(() => {
        if (status === 'authenticated') fetchAllPosts();
    }, [status]);

    return (
        <>
            {loading ? (
                <div className='flex items-center justify-center mt-8'>
                    <span className="loading loading-lg"></span>
                </div>
            ) : posts.length === 0 ? ( 
                <h1>No posts found.</h1>
            ) : (
                <div>
                    {posts.map((post: PostValues) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onDelete={() => handleDeletePost(post.id)}
                            onLike={() => handleLike(post.id)}
                            isOwner={session?.user?.id === post.userId}
                            liked={likedPosts.some((likedPost) => likedPost.postId === post.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}