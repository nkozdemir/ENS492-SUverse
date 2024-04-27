"use client";

import { checkPostLiked } from '@/lib/api';
import { PostValues } from '@/types/interfaces';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Toast from '../toast';
import { useRouter } from 'next/navigation';

interface PostContextType {
    postDetails: PostValues;
    loading: boolean;
    isOwner: boolean;
    isLiked: boolean;
    likePost: () => void;
    deletePost: () => void;
    // Edit post
    editMode: boolean;
    editedTitle: string;
    editedContent: string;
    toggleEditMode: () => void;
    handleTitleChange: (value: string) => void;
    handleContentChange: (value: string) => void;
    saveEdits: () => void;
    submitting: boolean;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ postId: string; children: ReactNode }> = ({ postId, children }) => {
    const [postDetails, setPostDetails] = useState<PostValues>({} as PostValues);

    const [loading, setLoading] = useState<boolean>(true);

    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();

    const fetchPostDetails = async () => {
        try {
            const res = await fetch(`/api/posts/get/detail?postId=${postId}`);
            const data = await res.json();
            if (data.status === 200) {
                const postData: PostValues = data.data;
                setPostDetails(postData);
                setIsOwner(postData.userId === session?.user?.id);
                setIsLiked(await checkPostLiked(postId));
                setEditedTitle(postData.post.title);
                setEditedContent(postData.post.content);
            } else {
                if (data.status === 404) Toast('err', 'Post not found');
                else Toast('err', 'Internal server error. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') fetchPostDetails();
    }, [status]);

    const likePost = async () => {
        // If post is already liked, unlike it
        if (isLiked) {
            // Remove like locally, reduce post.post.likeCount by 1
            setIsLiked(false);
            setPostDetails({ ...postDetails, post: { ...postDetails.post, likeCount: postDetails.post.likeCount - 1 } });
            try {
                const res = await fetch(`/api/posts/like/deleteLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                });

                const data = await res.json();
                console.log('Unlike post response:', data);
                if (data.status !== 200) Toast('err', 'Failed to unlike post.');
            } catch (error) {
                console.error('Error unliking post:', error);
                Toast('err', 'Internal server error.');
            }
        } else {
            // Add like locally, increase post.post.likeCount by 1
            setIsLiked(true);
            setPostDetails({ ...postDetails, post: { ...postDetails.post, likeCount: postDetails.post.likeCount + 1 } });
            try {
                const res = await fetch(`/api/posts/like/createLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                });

                const data = await res.json();
                console.log('Like post response:', data);
                if (data.status !== 201) Toast('err', data.message);
            } catch (error) {
                console.error('Error liking post:', error);
                Toast('err', 'Internal server error.');
            }
        }
    };

    const deletePost = async () => {
        try {
            const res = await fetch(`/api/posts/deletePost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            const data = await res.json();
            console.log('Delete post response:', data);
            if (data.status === 200) {
                Toast('ok', 'Post deleted successfully.');
                // Redirect to previous page
                router.back();
            } else {
                Toast('err', 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Toast('err', 'Internal server error.');
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleTitleChange = (value: string) => {
        setEditedTitle(value);
    };

    const handleContentChange = (value: string) => {
        setEditedContent(value);
    };

    const saveEdits = async () => {
        try {
            setSubmitting(true);
            const res = await fetch(`/api/posts/editPost`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postDetails.postId,
                    title: editedTitle,
                    content: editedContent,
                    attachments: [], // You can include attachments if needed
                }),
            });
    
            const data = await res.json();
            console.log('Edit post response:', data);
            if (res.status === 200) {
                Toast('ok', 'Post edited successfully.');
                // If successful, toggle edit mode off
                toggleEditMode();
                fetchPostDetails();
            } else {
                Toast('err', 'Failed to edit post.');
            }
        } catch (error) {
            console.error('Error editing post:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setSubmitting(false);
        }
    };    

    const contextValue: PostContextType = { 
        postDetails, 
        loading, 
        isOwner, 
        isLiked, 
        likePost, 
        deletePost,
        editMode,
        editedTitle,
        editedContent,
        toggleEditMode,
        handleTitleChange,
        handleContentChange,
        saveEdits,
        submitting, 
    };

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
};

export const usePost = (): PostContextType => {
    const context = useContext(PostContext);
    if (!context) throw new Error('usePost must be used within a PostProvider');
    return context;
};