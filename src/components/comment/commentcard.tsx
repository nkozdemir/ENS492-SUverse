"use client";

import { formatDate } from '@/lib/utils';
import { CommentValues } from '@/types/interfaces';
import { BiLike, BiEdit, BiTrash, BiReply } from 'react-icons/bi';
import Link from 'next/link';

interface Props {
    comment: CommentValues;
}

const CommentCard: React.FC<Props> = ({ comment }) => {
    const handleLike = () => {
        // Implement like functionality here
    };

    const handleDelete = () => {
        // Implement delete functionality here
    };

    const handleEdit = () => {
        // Implement edit functionality here
    };

    const handleReply = () => {
        // Implement reply functionality here
    };

    return (
        <div className="border rounded-lg p-4 mb-4">
            <p className="mb-2">{comment.content}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link href={`/user/${comment.user.id}`} className="mr-2">{comment.user.name} (@{comment.user.username})</Link>
                <p className="mr-2">{formatDate(comment.createdAt)}</p>
            </div>
            <div className="flex space-x-4">
                <button onClick={handleLike} className="flex items-center text-gray-500 hover:text-gray-700">
                    <BiLike size={20} />
                    <span className="ml-1">{comment.likeCount}</span>
                </button>
                <button onClick={handleEdit} className="flex items-center text-gray-500 hover:text-gray-700">
                    <BiEdit size={20} />
                </button>
                <button onClick={handleDelete} className="flex items-center text-gray-500 hover:text-gray-700">
                    <BiTrash size={20} />
                </button>
                <button onClick={handleReply} className="flex items-center text-gray-500 hover:text-gray-700">
                    <BiReply size={20} />
                </button>
            </div>
            {comment.children && (
                <div className="pl-4 border-l-2 border-gray-300 mt-4">
                    {comment.children.map(child => (
                        <CommentCard key={child.id} comment={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentCard;