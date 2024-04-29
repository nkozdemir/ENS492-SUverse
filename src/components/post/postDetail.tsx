"use client";

import { PostProvider, usePost } from '../context/PostContext'; 
import Link from 'next/link';
import { BiSolidLike, BiLike } from 'react-icons/bi';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { formatDate } from '@/lib/utils'; 
import { useRouter } from 'next/navigation';
import CommentForm from '../comment/commentForm';
import CommentList from '../comment/commentlist';
import Toast from '../toast';
import { useState } from 'react';

const PostDetailPage = ({ postId }: { postId: string }) => {
    return (
        <PostProvider postId={postId as string}>
            <PostDetails />
        </PostProvider>
    );
};

const PostDetails = () => {
    const { postDetails, loading, isOwner, isLiked, likePost, deletePost, editMode, editedTitle, editedContent, toggleEditMode, handleTitleChange, handleContentChange, saveEdits, submitting, rootComments, createLocalComment } = usePost();
    const router = useRouter();
    const [submittingComment, setSubmittingComment] = useState(false);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 w-full mt-8">
                {/* Skeleton for post details */}
                <div className="skeleton w-full h-64"></div>

                {/* Skeleton for post actions */}
                <div className="skeleton w-full h-16"></div>

                {/* Skeleton for comment form */}
                <div className="skeleton w-full h-32"></div>

                {/* Skeleton for comment list */}
                <div className="skeleton h-72 w-full"></div>
            </div>
        );
    }

    if (!postDetails) {
        return <h1>No post found.</h1>;
    }

    const submitComment = async (content: string) => {
        try {
            setSubmittingComment(true);
            const res = await fetch(`/api/comments/createComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postDetails.id,
                    content: content,
                }),
            });
            const data = await res.json();
            console.log('Add comment response:', data);
            if (data.status === 201) {
                //console.log('Comment added:', data.data);
                Toast('ok', 'Comment added successfully.');
                createLocalComment(data.data);
            }
            else {
                //console.log('Failed to add comment:', data);
                Toast('err', 'Failed to add comment.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setSubmittingComment(false);
        }
    }

    return (
        <div className="container mx-auto mt-4">
            <button onClick={() => router.back()}>Go Back</button>
            <h1 className="font-bold text-2xl mb-8 mt-2">Post Details</h1>

            {/* Post Details */}
            <div>
                <div className="bg-base-200 p-6 mb-8 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">{postDetails.post.title}</h2>
                    <div className="mb-2">
                        Category:
                        <Link href={`/category/${postDetails.post.categoryId}/${postDetails.post.category.name}`} className="text-lg font-semibold ml-2">
                            {postDetails.post.category.name}
                        </Link>
                    </div>
                    <div className="mb-8">
                        By:
                        <Link href={`/user/${postDetails.userId}`} className="font-semibold text-md ml-2">
                            {postDetails.post.user.name}
                            <span className="text-gray-500 ml-2 font-normal">(@{postDetails.post.user.username})</span>
                        </Link>
                    </div>
                    {!editMode && (
                        <p className="mb-8">{postDetails.post.content}</p>
                    )}
                    {editMode && (
                        <textarea
                            value={editedContent}
                            onChange={(e) => handleContentChange(e.target.value)}
                            rows={8}
                            className="textarea mb-8"
                            placeholder="Enter content..."
                        />
                    )}
                    <div className="text-sm text-gray-500">
                        <p className='mb-2'>Created: {formatDate(new Date(postDetails.createdAt))}</p>
                        {postDetails.editedAt != null && (
                            <p>Edited: {formatDate(new Date(postDetails.editedAt))}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Actions */}
            <div className="bg-base-200 rounded p-4 mb-8 flex items-center space-x-4">
                <button
                    className="inline-flex items-center btn btn-ghost btn-circle"
                    onClick={likePost}
                >
                    {isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                    <span>{postDetails.post.likeCount}</span>
                </button>
                {isOwner && (
                    <>
                        {!editMode && (
                            <button
                                onClick={toggleEditMode}
                                className="inline-flex items-center btn btn-ghost btn-circle"
                            >
                                <MdEdit size={20} />
                            </button>
                        )}
                        {editMode && (
                            <>
                                <button
                                    onClick={saveEdits}
                                    className={`inline-flex items-center btn btn-primary ${submitting ? 'btn-disabled' : ''}`}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="animate-spin mr-2">&#9696;</span>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                                <button
                                    onClick={toggleEditMode}
                                    className="inline-flex items-center btn btn-ghost"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        <button
                            onClick={deletePost}
                            className="inline-flex items-center btn btn-ghost btn-circle"
                        >
                            <MdDeleteOutline size={20} />
                        </button>
                    </>
                )}
                
            </div>

            {/* Comment Form */}
            <div className='bg-base-200 p-6 mb-8 rounded-lg'>
                <h1 className='font-semibold text-2xl mb-8'>Add a comment</h1>
                <CommentForm 
                    onSubmit={submitComment} 
                    submitting={submittingComment}
                    initialContent='' 
                /> 
            </div>

            {/* Comment List */}
            <div className="bg-base-200 p-6 rounded-lg">
                <h1 className='font-semibold text-2xl mb-8'>Comments {postDetails.post.commentCount > 0 && `(${postDetails.post.commentCount})`}</h1>
                {rootComments != null && rootComments?.length > 0 ? (
                    <CommentList comments={rootComments} />
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
};

export default PostDetailPage;