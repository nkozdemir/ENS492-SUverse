"use client";

import { formatDate } from '@/lib/utils';
import { CommentValues } from '@/types/interfaces';
import { BiLike, BiSolidLike, BiEdit, BiTrash, BiReply } from 'react-icons/bi';
import Link from 'next/link';

interface Props {
    comment: CommentValues;
    isLiked: boolean;
    isOwner: boolean;
    onLike: (commentId: string) => void;
}

const CommentCard: React.FC<Props> = ({ comment, isLiked, isOwner, onLike }) => {
    return (
        <div className="border rounded-lg p-4 mb-4">
            <p className="mb-2">{comment.content}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link href={`/user/${comment.user.id}`} className="mr-2">{comment.user.name} (@{comment.user.username})</Link>
                <p className="mr-2">{formatDate(comment.createdAt)}</p>
            </div>
            <div className="flex space-x-4">
                <button onClick={() => onLike(comment.id)} className="flex items-center text-gray-500 hover:text-gray-700">
                    {isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                    <span className="ml-1">{comment.likeCount}</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <BiReply size={20} />
                </button>
                {isOwner && (
                    <>
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <BiEdit size={20} />
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <BiTrash size={20} />
                        </button>
                    </>
                )}
            </div>
            {comment.children && (
                <div className="pl-4 border-l-2 border-gray-300 mt-4">
                    {comment.children.map(child => (
                        <CommentCard 
                            key={child.id} 
                            comment={child}
                            isLiked={isLiked}
                            isOwner={isOwner} 
                            onLike={onLike}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentCard;