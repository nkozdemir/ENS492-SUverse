"use client";

import { PostProvider, usePost } from '../context/PostContext'; 
import Link from 'next/link';
import { BiSolidLike, BiLike } from 'react-icons/bi';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { formatDate } from '@/lib/utils'; 
import CommentForm from '../comment/commentForm';
import CommentList from '../comment/commentlist';
import Toast from '../toast';
import { useState } from 'react';
import UserProfilePicture from '../userProfilePicture';

const PostDetailPage = ({ postId }: { postId: string }) => {
    return (
        <PostProvider postId={postId as string}>
            <PostDetails />
        </PostProvider>
    );
};

const PostDetails = () => {
    const { postDetails, loading, isOwner, isLiked, likePost, deletePost, editMode, editedTitle, editedContent, toggleEditMode, handleTitleChange, handleContentChange, saveEdits, submitting, rootComments, createLocalComment } = usePost();
    const [submittingComment, setSubmittingComment] = useState(false);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 w-full mt-8">
                <div className="skeleton w-full h-64"></div>
                <div className="skeleton w-full h-16"></div>
                <div className="skeleton w-full h-32"></div>
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
        <div className="container mx-auto">
            <h1 className="font-bold text-2xl mb-8 mt-2">Post Details</h1>

            {/* Post Details */}
            <div>
                <div className="bg-base-200 p-6 mb-8 rounded-lg">
                    {!editMode && (
                        <h2 className="text-2xl font-semibold mb-2">{postDetails.post.title}</h2>
                    )}
                    {editMode && (
                        <div className='mb-4'>
                            <h2 className='text-xl font-semibold mb-2'>Title</h2>
                            <div className='flex flex-col'>
                                <input
                                    type='text'
                                    value={editedTitle}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="input input-bordered mb-4"
                                    placeholder="Enter title..."
                                    required
                                />
                                <button 
                                    onClick={() => handleTitleChange('')} 
                                    disabled={submitting || editedTitle.trim() === ''}
                                    className={`btn btn-ghost btn-outline ${submitting ? 'btn-disabled' : ''} max-w-xs`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                    {!editMode && (
                        <>
                            <div className="mb-4">
                                <Link href={`/category/${postDetails.post.categoryId}/${postDetails.post.category.name}`} className="text-lg font-semibold">
                                    {postDetails.post.category.name}
                                </Link>
                            </div>
                            <div className="flex items-center my-4">
                                <div className='mr-2'>
                                    <Link href={`/user/${postDetails.userId}`}>
                                        <UserProfilePicture imageUrl={postDetails.post.user.profilePic} size={50} />
                                    </Link>
                                </div>
                                <Link href={`/user/${postDetails.userId}`} className="font-semibold text-md ml-2">
                                    {postDetails.post.user.name}
                                    <span className="text-gray-500 ml-2 font-normal">(@{postDetails.post.user.username})</span>
                                </Link>
                            </div>
                        </>
                    )}
                    {!editMode && (
                        <p className="mb-8">{postDetails.post.content}</p>
                    )}
                    {editMode && (
                        <div className='mb-4'>
                            <h2 className='text-xl font-semibold mb-2'>Content</h2>
                            <div className='flex flex-col'>
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    rows={4}
                                    className="textarea mb-2"
                                    placeholder="Enter content..."
                                    required
                                />
                                <br />
                                <button 
                                    onClick={() => handleContentChange('')} 
                                    disabled={submitting || editedContent.trim() === ''}
                                    className={`btn btn-ghost btn-outline ${submitting ? 'btn-disabled' : ''} max-w-xs`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                    {editMode && (
                        <div className='my-8 flex flex-row items-center justify-center space-x-4'>
                            <button
                                onClick={saveEdits}
                                className={`btn w-1/2 btn-primary ${submitting ? 'btn-disabled' : ''}`}
                                disabled={submitting || editedTitle.trim() === '' || editedContent.trim() === '' || (editedTitle === postDetails.post.title && editedContent === postDetails.post.content)}
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
                                disabled={submitting}
                                className={`btn btn-outline w-1/2 btn-ghost ${submitting ? 'btn-disabled' : ''}`}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <div className="text-sm text-gray-500">
                        <p className='mb-2'>Created: {formatDate(new Date(postDetails.createdAt))}</p>
                        {postDetails.editedAt != null && (
                            <p>Edited: {formatDate(new Date(postDetails.editedAt))}</p>
                        )}
                    </div>

                    {/* Post Actions */}
                    {!editMode && (
                        <div className="flex items-center space-x-4 mt-4">
                            <button
                                onClick={likePost}
                                disabled={submitting}
                                className={`inline-flex items-center btn btn-ghost btn-circle ${submitting ? 'btn-disabled' : ''}`}
                            >
                                {isLiked ? <BiSolidLike size={24} /> : <BiLike size={24} />}
                                <span>{postDetails.post.likeCount}</span>
                            </button>
                            {isOwner && (
                                <>
                                    <button
                                        onClick={toggleEditMode}
                                        className="inline-flex items-center btn btn-ghost btn-circle"
                                    >
                                        <MdOutlineEdit size={24} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                                            modal?.showModal();
                                        }}
                                        disabled={submitting}
                                        className={`inline-flex items-center btn btn-error btn-circle ${submitting ? 'btn-disabled' : ''}`}
                                    >
                                        <MdDeleteOutline size={24} />
                                    </button>
                                    <dialog id="my_modal_1" className="modal">
                                        <div className="modal-box">
                                            <h3 className="font-bold text-lg">Delete Post</h3>
                                            <p className="py-4">Do you want to delete this post?</p>
                                            <div className="modal-action">
                                                <form method="dialog">
                                                    <div className='flex flex-row space-x-4'>
                                                        <button className="btn btn-error" onClick={deletePost}>Delete</button>
                                                        <button className="btn">Cancel</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Comment Form */}
            <div className='bg-base-200 p-6 mb-8 rounded-lg'>
                <h1 className='font-semibold text-2xl mb-8'>Add a Comment</h1>
                <CommentForm 
                    onSubmit={submitComment} 
                    submitting={submittingComment}
                    initialContent='' 
                /> 
            </div>

            {/* Comment List */}
            <div className="bg-base-200 p-6 rounded-lg">
                <h1 className='font-semibold text-2xl mb-4'>Comments {postDetails.post.commentCount > 0 && `(${postDetails.post.commentCount})`}</h1>
                {rootComments != null && rootComments?.length > 0 ? (
                    <CommentList comments={rootComments} filterHidden={false}/>
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
};

export default PostDetailPage;