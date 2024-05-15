"use client";

import Toast from '@/components/toast';
import { useState, useEffect } from 'react';
import { PostDetailValues, PostValues } from '@/types/interfaces';
import PostCard from './postcard';

interface PostListProps {
    postData: PostValues[];
    showingUserPosts: boolean;
}

export default function PostList({ postData, showingUserPosts }: PostListProps) {
    const [posts, setPosts] = useState<PostValues[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('title');
    const [sortBy, setSortBy] = useState<string>('createdAt');

    const handleLike = async (post: PostDetailValues) => {
        const postId = post.id;
        if (post.isLiked) {
            post.isLiked = false;
            setPosts(prevPosts => prevPosts.map((p) => {
                if (p.id === postId) {
                    return {
                        ...p,
                        post: {
                            ...p.post,
                            likeCount: p.post.likeCount - 1,
                        },
                    };
                }
                return p;
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
            setPosts(prevPosts => prevPosts.map((p) => {
                if (p.id === postId) {
                    return {
                        ...p,
                        post: {
                            ...p.post,
                            likeCount: p.post.likeCount + 1,
                        },
                    };
                }
                return p;
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
                return true;
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
        <div className="space-y-4">
            {posts.length > 1 && (
                <details className="collapse collapse-arrow bg-base-200" tabIndex={0}>
                    <summary className="collapse-title text-xl font-medium">Filter & Search</summary>
                    <div className="collapse-content" tabIndex={0}> 
                        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 p-4 bg-base-200">
                            <label className="form-control w-full lg:max-w-xs">
                                <div className="label">
                                    <span className="label-text">Search</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Search by ${filterBy}...`}
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                    className="input input-primary input-bordered"
                                />
                            </label>
                            <label className="form-control w-full lg:max-w-xs">
                                <div className="label">
                                    <span className="label-text">Filter By</span>
                                </div>
                                <select
                                    value={filterBy}
                                    onChange={handleFilterChange}
                                    className="select select-primary select-bordered"
                                >
                                    <option value="title">Title</option>
                                    {!showingUserPosts && (
                                        <>
                                            <option value="name">Author Name</option>
                                            <option value="username">Author Username</option>
                                        </>
                                    )}
                                    <option value="content">Content</option>
                                </select>
                            </label>
                            <label className="form-control w-full lg:max-w-xs">
                                <div className="label">
                                    <span className="label-text">Sort By</span>
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
                                className={`btn w-full lg:w-auto ${searchTerm === '' && filterBy === 'title' && sortBy === 'createdAt' ? 'btn-disabled' : 'btn-primary btn-outline'} `}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </details>
            )}
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
