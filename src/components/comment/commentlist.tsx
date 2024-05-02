import Comment from './comment';
import { CommentValues } from '@/types/interfaces';
import { useState } from 'react';

interface Props {
    comments: CommentValues[];
    filterHidden: boolean;
}

const CommentList: React.FC<Props> = ({ comments, filterHidden }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('content');
    const [sortBy, setSortBy] = useState<string>('createdAt');

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterBy(e.target.value);
    };

    const clearFilterAndSort = () => {
        setSearchTerm('');
        setFilterBy('content');
        setSortBy('createdAt');
    };

    // Filter comments based on search term and filterBy option
    const filteredComments = comments.filter(comment => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        switch (filterBy) {
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
        } else if (sortBy === '-createdAt') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'likes') {
            return a.likeCount - b.likeCount;
        } else if (sortBy === '-likes') {
            return b.likeCount - a.likeCount;
        }
        return 0;
    });

    return (
        <div className="space-y-4">
            {!filterHidden && comments.length > 1 && (
                <div className="flex items-center space-x-6 bg-base-100 p-4 shadow-lg rounded-lg mb-8">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Search</span>
                        </div>
                        <input
                            type="text"
                            placeholder={`Search by ${filterBy}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            <option value="content">Content</option>
                            <option value="name">Author Name</option>
                            <option value="username">Author Username</option>
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
                            <option value="likes">Likes (Ascending)</option>
                            <option value="-likes">Likes (Descending)</option>
                        </select>
                    </label>
                    <button
                        onClick={clearFilterAndSort}
                        disabled={searchTerm === '' && filterBy === 'content' && sortBy === 'createdAt'}
                        className={`btn mt-auto ${searchTerm === '' && filterBy === 'content' && sortBy === 'createdAt' ? 'btn-disabled' : 'btn-outline btn-primary'}`}
                    >
                        Clear Filter & Sort
                    </button>
                </div>
            )}
            {sortedComments.length === 0 ? (
                <h1>No comments found. Try changing the filter options.</h1>
            ) : (
                sortedComments.map(comment => (
                    <Comment 
                        key={comment.id} 
                        comment={comment}
                    />
                ))
            )}
        </div>
    );
};

export default CommentList;