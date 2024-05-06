import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { CommentValues } from '@/types/interfaces';
import Link from 'next/link';
import { useState } from 'react';

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

    return (
        <div>
            {comments.length > 1 && (
                <div className="flex items-center space-x-6 bg-base-200 p-4 shadow-lg rounded-lg mb-8">
                    <label className="form-control w-full max-w-xs">
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
                        <label className="form-control">
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
                        </select>
                    </label>
                    <button
                        onClick={clearFilterAndSort}
                        disabled={searchTerm === '' && searchField === 'content' && sortBy === 'createdAt'}
                        className={`btn mt-auto ${searchTerm === '' && searchField === 'content' && sortBy === 'createdAt' ? 'btn-disabled' : 'btn-outline btn-primary'}`}
                    >
                        Clear Filter & Sort
                    </button>
                </div>
            )}
            {!comments.length ? (
                <h1>No comments.</h1>
            ) : sortedComments.length === 0 ? (
                <h1>No comments found. Try changing the filter options.</h1>
            ) : (
                sortedComments.map(comment => (
                    <div key={comment.id} className="rounded-lg shadow-lg p-4 mb-4 bg-base-200">
                        <div className="flex items-center mb-2">
                            {comment.user.profilePic? (
                                <Image src={comment.user.profilePic} alt={'userImage'} width={32} height={32} className="rounded-full mr-4" />
                            ) : (
                                <Image src={'/default-profile-img.png'} alt={'userImage'} width={32} height={32} className="rounded-full mr-4" />
                            )}
                            <Image src={'/default-profile-img.png'} alt={'userImage'} width={32} height={32} className="rounded-full mr-4" />)
                            <Link href={`/user/${comment.userId}`}>
                                <p className="font-semibold">{comment.user.name}</p>
                                <p className="font-normal">@{comment.user.username}</p>
                            </Link>
                            <p className="ml-auto">{formatDate(new Date(comment.createdAt))}</p>
                        </div>
                        <p className="mb-2 text-lg">{comment.content}</p>
                        <Link href={`/post/${comment.postId}`} className="mt-2">Post: {comment.post.title}</Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default CommentProfileList;
