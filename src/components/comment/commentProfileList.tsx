"use client";

import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { CommentValues } from '@/types/interfaces';
import Link from 'next/link';

interface CommentProfileListProps {
    comments: CommentValues[];
}

const CommentProfileList = ({ comments }: CommentProfileListProps) => {
    if (!comments.length) 
        return (
            <p className="text-gray-600">No comments yet.</p>
        )
    return (
        <div>
            {comments.map(comment => (
                <div key={comment.id} className="rounded-lg shadow-lg p-4 mb-4 bg-base-200">
                    <div className="flex items-center mb-2">
                        <Image src={'/default-profile-img.png'} alt={'userImage'} width={32} height={32} className="rounded-full mr-4" />
                        <Link href={`/user/${comment.userId}`}>
                            <p className="font-semibold">{comment.user.name}</p>
                            <p className="font-normal">@{comment.user.username}</p>
                        </Link>
                        <p className="ml-auto">{formatDate(new Date(comment.createdAt))}</p>
                    </div>
                    <p className="mb-2 text-lg">{comment.content}</p>
                    <Link href={`/post/${comment.postId}`} className="mt-2">Post: {comment.post.title}</Link>
                </div>
            ))}
        </div>
    );
}

export default CommentProfileList;