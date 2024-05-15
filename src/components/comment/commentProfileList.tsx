import { formatDate } from '@/lib/utils';
import { CommentValues } from '@/types/interfaces';
import Link from 'next/link';
import { useState } from 'react';
import UserProfilePicture from '../userProfilePicture';

interface CommentProfileListProps {
    comments: CommentValues[];
    showingUserComments: boolean;
}

const CommentProfileList = ({ comments, showingUserComments }: CommentProfileListProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchField, setSearchField] = useState<string>('content');
    const [sortBy, setSortBy] = useState<string>('createdAt');

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchField(e.target.value);
    };

    const clearFilterAndSort = () => {
        setSearchTerm('');
        setSearchField('content');
        setSortBy('createdAt');
    };

    // Filter comments based on search term and selected search field
    const filteredComments = comments.filter(comment => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        switch (searchField) {
            case 'content':
                return comment.content.toLowerCase().includes(lowerSearchTerm);
            case 'name':
                return comment.user.name.toLowerCase().includes(lowerSearchTerm);
            case 'username':
                return comment.user.username.toLowerCase().includes(lowerSearchTerm);
            default:
                return false;
        }
    });

    // Sort comments based on sortBy option
    const sortedComments = filteredComments.slice().sort((a, b) => {
        if (sortBy === 'createdAt') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
    });

    const renderShortenedContent = (content: string, maxLength: number) => {
        if (content.length > maxLength) {
            return content.slice(0, maxLength) + "...";
        }
        return content;
    };

    return (
        <div className='space-y-4'>
            {comments.length > 1 && (
                <details className="collapse collapse-arrow bg-base-200" tabIndex={0}>
                    <summary className="collapse-title text-xl font-medium">Filter & Search</summary>
                    <div className="collapse-content" tabIndex={0}>
                        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 bg-base-200 p-4">
                            <label className="form-control lg:w-1/4 w-full">
                                <div className="label">
                                    <span className="label-text">Search</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Search by ${searchField}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input input-primary input-bordered"
                                />
                            </label>
                            {!showingUserComments && (
                                <label className="form-control lg:w-1/4 w-full">
                                    <div className='label'>
                                        <span className='label-text'>Filter By Field</span>
                                    </div>
                                    <select
                                        value={searchField}
                                        onChange={handleSearchFieldChange}
                                        className="select select-primary select-bordered"
                                    >
                                        <option value="content">Content</option>
                                        <option value="name">User Name</option>
                                        <option value="username">Username</option>
                                    </select>
                                </label>
                            )}
                            <label className="form-control lg:w-1/4 w-full">
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
                                </select>
                            </label>
                            <button
                                onClick={clearFilterAndSort}
                                disabled={searchTerm === '' && searchField === 'content' && sortBy === 'createdAt'}
                                className={`btn mt-auto w-full lg:w-auto ${searchTerm === '' && searchField === 'content' && sortBy === 'createdAt' ? 'btn-disabled' : 'btn-outline btn-primary'}`}
                            >
                                Clear 
                            </button>
                        </div>
                    </div>
                </details>
            )}
            {!comments.length ? (
                <h1>No comments.</h1>
            ) : sortedComments.length === 0 ? (
                <h1>No comments found. Try changing the filter options.</h1>
            ) : (
                sortedComments.map(comment => (
                    <div key={comment.id} className="rounded-lg shadow-lg p-4 mb-4 bg-base-200">
                        <div className="flex items-center mb-2">
                            <div className='mr-2'>
                                <Link href={`/user/${comment.userId}`}>
                                    <UserProfilePicture imageUrl={comment.user.profilePic} size={50} />
                                </Link>
                            </div>
                            <Link href={`/user/${comment.userId}`}>
                                <p className="font-semibold">{comment.user.name}</p>
                                <p className="font-normal">@{comment.user.username}</p>
                            </Link>
                            <p className="lg:ml-auto ml-8">{formatDate(new Date(comment.createdAt))}</p>
                        </div>
                        <Link href={`/post/${comment.postId}`}>
                            <p className="mb-2 text-lg">{renderShortenedContent(comment.content, 50)}</p>
                        </Link>
                        <Link href={`/post/${comment.postId}`} className="mt-2">Post: {comment.post.title}</Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default CommentProfileList;
