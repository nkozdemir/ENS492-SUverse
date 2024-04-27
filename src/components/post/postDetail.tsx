"use client";

import { PostProvider, usePost } from '../context/PostContext'; 
import Link from 'next/link';
import { BiSolidLike, BiLike } from 'react-icons/bi';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { formatDate } from '@/lib/utils'; 
import { useRouter } from 'next/navigation';
import CommentForm from '../comment/commentForm';

const PostDetailPage = ({ postId }: { postId: string }) => {
    return (
        <PostProvider postId={postId as string}>
            <PostDetails />
        </PostProvider>
    );
};

const PostDetails = () => {
    const { postDetails, loading, isOwner, isLiked, likePost, deletePost, editMode, editedTitle, editedContent, toggleEditMode, handleTitleChange, handleContentChange, saveEdits, submitting } = usePost();
    const router = useRouter();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!postDetails) {
        return <h1>No post found.</h1>;
    }

    return (
        <div className="container mx-auto mt-4">
            <button onClick={() => router.back()}>Go Back</button>
            <h1 className="font-bold text-2xl mb-8">Post Details</h1>
            {/* Post Details */}
            <div className="bg-base-200 p-6 mb-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{postDetails.post.title}</h2>
                {!editMode && (
                    <></>
                )}
                {editMode && (
                    <textarea
                        value={editedTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        rows={2}
                        className="textarea"
                        placeholder="Enter title..."
                    />
                )}
                <Link href={`/user/${postDetails.post.user.id}`} className="font-semibold mb-2">
                    {postDetails.post.user.name} (@{postDetails.post.user.username})
                </Link>
                <br />
                <Link href={`/category/${postDetails.post.category.id}/${postDetails.post.category.name}`} className="font-semibold mb-2">
                    {postDetails.post.category.name}
                </Link>
                <br />
                <p>{postDetails.post.content}</p>
                {!editMode && (
                    <></>
                )}
                {editMode && (
                    <textarea
                        value={editedContent}
                        onChange={(e) => handleContentChange(e.target.value)}
                        rows={4}
                        className="textarea"
                        placeholder="Enter content..."
                    />
                )}
                <br />
                <p>Created: {formatDate(new Date(postDetails.createdAt))}</p>
                <p>Updated: {formatDate(new Date(postDetails.updatedAt))}</p>
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
            <CommentForm postId={postDetails.id} />
        </div>
    );
};

export default PostDetailPage;