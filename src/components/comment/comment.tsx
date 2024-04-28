"use client";

import { formatDate } from '@/lib/utils';
import { CommentValues } from '@/types/interfaces';
import { BiLike, BiSolidLike, BiEdit, BiTrash, BiReply } from 'react-icons/bi';
import { MdOutlineCancel } from "react-icons/md";
import Link from 'next/link';
import CommentList from './commentlist';
import { useState } from 'react';
import { usePost } from '../context/PostContext';
import Toast from '../toast';
import CommentForm from './commentForm';
import { useSession } from 'next-auth/react';

interface Props {
    comment: CommentValues;
}

const Comment: React.FC<Props> = ({ comment }) => {
    const { getReplies, deleteLocalComment, editLocalComment, createLocalComment, toggleLikeComment } = usePost();
    const [childrenHidden, setChildrenHidden] = useState(true);
    const childComments = getReplies(comment.id);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const { data: session, status } = useSession();

    const deleteComment = async () => {
        try {
            const res = await fetch(`/api/comments/deleteComment?commentId=${comment.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            console.log('Delete comment response:', data);
            if (data.status === 200) {
                deleteLocalComment(comment.id);
                console.log('Comment deleted:', comment.id);
                Toast('ok', 'Comment deleted successfully.');
            } else {
                console.log('Failed to delete comment:', comment.id);
                Toast('err', 'Failed to delete comment.');
            }
        } catch (error) {
            console.error(error);
            Toast('err', 'Internal server error. Please try again.');
        }
    }

    const editComment = async (content: string) => {
        try {
            setSubmitting(true);
            const res = await fetch(`/api/comments/editComment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    commentId: comment.id,
                    content, 
                }),
            });
            const data = await res.json();
            console.log('Edit comment response:', data);
            if (data.status === 200) {
                console.log('Comment edited:', comment.id);
                editLocalComment(comment.id, content);
                setIsEditing(false);
                Toast('ok', 'Comment edited successfully.');
            } else {
                console.log('Failed to edit comment:', comment.id);
                Toast('err', 'Failed to edit comment.');
            }
        } catch (error) {
            console.error(error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const replyComment = async (content: string) => {
        try {
            setSubmitting(true);
            const res = await fetch(`/api/comments/createComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    postId: comment.postId,
                    content: content, 
                    parentId: comment.id,
                }),
            });
            const data = await res.json();
            console.log('Reply comment response:', data);
            if (data.status === 201) {
                console.log('Comment added:', data.data);
                setIsReplying(false);
                createLocalComment(data.data);
                Toast('ok', 'Comment added successfully.');
                // Add comment to local state
            } else {
                console.log('Failed to add comment:', data);
                Toast('err', 'Failed to add comment.');
            }
        } catch (error) {
            console.error(error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const handleLike = async () => {
        toggleLikeComment(comment.id);
        if (comment.isLiked) {
            // Unlike
            try {
                const res = await fetch(`/api/comments/like/deleteLike?commentId=${comment.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log('Unlike comment response:', data);
                if (data.status === 200) {
                    console.log('Comment unliked:', comment.id);
                } else {
                    console.log('Failed to unlike comment:', comment.id);
                    Toast('err', 'Failed to unlike comment.');
                }
            } catch (error) {
                console.error(error);
                Toast('err', 'Internal server error. Please try again.');
            }
        } else {
            // Like
            try {
                const res = await fetch(`/api/comments/like/createLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        commentId: comment.id,
                    }),
                });
                const data = await res.json();
                console.log('Like comment response:', data);
                if (data.status === 201) {
                    console.log('Comment liked:', comment.id);
                } else {
                    console.log('Failed to like comment:', comment.id);
                    Toast('err', 'Failed to like comment.');
                }
            } catch (error) {
                console.error(error);
                Toast('err', 'Internal server error. Please try again.');
            }
        }
    }

    return (
        <div className="border rounded-lg p-4 mb-4">
            {isEditing ? (
                <CommentForm 
                    onSubmit={editComment}
                    submitting={submitting}
                    initialContent={comment.content}
                />
            ) : (
                <p className="mb-2">{comment.content}</p>
            )}
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link href={`/user/${comment.user.id}`} className="mr-2">{comment.user.name} (@{comment.user.username})</Link>
                <p className="mr-2">{formatDate(comment.createdAt)}</p>
            </div>
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={handleLike} 
                    className="flex items-center text-gray-500 hover:text-gray-700"
                >
                    {comment.isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                    <span className="ml-1">{comment.likeCount}</span>
                </button>
                {isReplying ? (
                    <button
                        onClick={() => setIsReplying(prev => !prev)}
                        className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                        <MdOutlineCancel size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsReplying(prev => !prev)} 
                        className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                        <BiReply size={20} />
                    </button>
                )}
                {comment.user.id === session?.user?.id && (
                    <>
                        {isEditing ? (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <MdOutlineCancel size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <BiEdit size={20} />
                            </button>
                        )}
                        <button
                            onClick={deleteComment} 
                            className="flex items-center text-gray-500 hover:text-gray-700"
                        >
                            <BiTrash size={20} />
                        </button>
                    </>
                )}
            </div>
            {isReplying && (
                <CommentForm 
                    onSubmit={replyComment}
                    submitting={submitting}
                    initialContent=''
                />
            )}
            {childComments?.length > 0 && (
                <>
                    <button
                        onClick={() => setChildrenHidden(!childrenHidden)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                    >
                        {childrenHidden ? 'Show' : 'Hide'} {childComments.length} replies
                    </button>
                    {!childrenHidden && (
                        <CommentList comments={childComments} />
                    )}
                </>
            )}
        </div>
    );
};

export default Comment;