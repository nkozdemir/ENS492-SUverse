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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('title');
    const [sortBy, setSortBy] = useState<string>('createdAt');

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

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterBy(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const clearFilterAndSort = () => {
        setSearchTerm('');
        setFilterBy('title');
        setSortBy('createdAt');
    };

    // Filter posts based on search term and filterBy option
    const filteredPosts = posts.filter((post) => {
        const { title, user, content } = post.post;
        const lowerSearchTerm = searchTerm.toLowerCase();
        switch (filterBy) {
            case 'title':
                return title.toLowerCase().includes(lowerSearchTerm);
            case 'name':
                return user.name.toLowerCase().includes(lowerSearchTerm);
            case 'username':
                return user.username.toLowerCase().includes(lowerSearchTerm);
            case 'content':
                return content.toLowerCase().includes(lowerSearchTerm);
            default:
                return true; // No filter applied
        }
    });

    const sortedPosts = filteredPosts.slice().sort((a, b) => {
        if (sortBy === 'createdAt') {
            return new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime();
        } else if (sortBy === '-createdAt') {
            return new Date(a.post.createdAt).getTime() - new Date(b.post.createdAt).getTime();
        } else if (sortBy === 'likes') {
            return b.post.likeCount - a.post.likeCount;
        } else if (sortBy === '-likes') {
            return a.post.likeCount - b.post.likeCount;
        } else if (sortBy === 'comments') {
            return b.post.commentCount - a.post.commentCount;
        } else if (sortBy === '-comments') {
            return a.post.commentCount - b.post.commentCount;
        }
        return 0;
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-6 bg-base-200 p-4 shadow-lg rounded-lg">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Filter By Terms</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="input input-primary input-bordered"
                    />
                </label>
                <label className="form-control">
                    <div className='label'>
                        <span className='label-text'>Filter By Field</span>
                    </div>
                    <select
                        value={filterBy}
                        onChange={handleFilterChange}
                        className="select select-primary select-bordered"
                    >
                        <option value="title">Title</option>
                        <option value="name">Author Name</option>
                        <option value="username">Author Username</option>
                        <option value="content">Content</option>
                    </select>
                </label>
                <label className="form-control">
                    <div className='label'>
                        <span className='label-text'>Sort By</span>
                    </div>
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="select select-primary select-bordered"
                    >
                        <option value="createdAt">Most Recent</option>
                        <option value="-createdAt">Oldest First</option>
                        <option value="likes">Likes (Descending)</option>
                        <option value="-likes">Likes (Ascending)</option>
                        <option value="comments">Comments (Descending)</option>
                        <option value="-comments">Comments (Ascending)</option>
                    </select>
                </label>
                <button
                    onClick={clearFilterAndSort}
                    disabled={searchTerm === '' && filterBy === 'title' && sortBy === 'createdAt'}
                    className={`btn mt-auto ${searchTerm === '' && filterBy === 'title' && sortBy === 'createdAt' ? 'btn-disabled btn-ghost' : 'btn-primary'}`}
                >
                    Clear Options 
                </button>
            </div>
            {posts.length === 0 ? (
                <h1>No posts found.</h1>
            ) : sortedPosts.length === 0 ? (
                <h1>No posts found. Try changing the filter options.</h1>
            ) : (
                <div>
                    {sortedPosts.map(({ post }) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={() => handleLike(post)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}