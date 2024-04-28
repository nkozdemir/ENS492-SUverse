"use client";

import { checkPostLiked } from '@/lib/api';
import { CommentValues, PostValues } from '@/types/interfaces';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
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
    // Comments
    getReplies: (parentId: string) => PostValues['comments'];
    rootComments: PostValues['comments'];
    createLocalComment: (comment: CommentValues) => void;
    deleteLocalComment: (commentId: string) => void;
    editLocalComment: (commentId: string, content: string, editedAt: Date) => void;
    toggleLikeComment: (commentId: string) => void;
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

    const [comments, setComments] = useState<PostValues['comments']>([]);

    useEffect(() => {
        if (postDetails?.comments == null) return;
        setComments(postDetails.comments);
    }, [postDetails?.comments]);

    const commentsByParentId = useMemo(() => {
        const group = {};
        comments.forEach(comment => {
            group[comment.parentId] ||= [];
            group[comment.parentId].push(comment);
        });
        return group;
    }, [comments]);

    const getReplies = (parentId: string) => {
        return commentsByParentId[parentId];
    }

    const createLocalComment = (comment: CommentValues) => {
        setComments(prevComments => {
            return [...prevComments, comment]
        })
        // Update commentCount locally
        setPostDetails({ ...postDetails, post: { ...postDetails.post, commentCount: postDetails.post.commentCount + 1 } });
    } 

    const deleteLocalComment = (commentId: string) => {
        // If user is admin, delete comment permanently
        if (session?.user?.isAdmin) {
            setComments(prevComments => {
                return prevComments.filter(comment => comment.id !== commentId);
            });
        } else {
            setComments(prevComments => {
                return prevComments.map(comment => {
                    if (comment.id === commentId) {
                        return { ...comment, content: 'This comment has been deleted.', isDeleted: true };
                    }
                    return comment;
                });
            });
        }
        // Update commentCount locally
        setPostDetails({ ...postDetails, post: { ...postDetails.post, commentCount: postDetails.post.commentCount - 1 } });
    }

    const editLocalComment = (commentId: string, content: string, editedAt: Date) => {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, content, editedAt };
                }
                return comment;
            });
        });
    }

    const toggleLikeComment = (commentId: string) => {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, isLiked: !comment.isLiked, likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1 };
                }
                return comment;
            });
        });
    }

    const fetchPostDetails = async () => {
        try {
            const res = await fetch(`/api/posts/get/detail?postId=${postId}`);
            const data = await res.json();
            console.log('Fetch post details response:', data);
            if (data.status === 200) {
                const postData: PostValues = data.data;
                setPostDetails(postData);
                setIsOwner(postData.userId === session?.user?.id || session?.user?.isAdmin);
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
                if (data.status !== 200) 
                    Toast('err', 'Failed to unlike post.');
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
                if (data.status !== 201)
                    Toast('err', data.message);
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
                //console.log('Post deleted successfully.');
                Toast('ok', 'Post deleted successfully.');
                router.back();
            } else {
                //console.log('Failed to delete post.');
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
                //console.log('Post edited successfully.');
                Toast('ok', 'Post edited successfully.');
                toggleEditMode();
                fetchPostDetails();
            } else {
                //console.log('Failed to edit post.');
                Toast('err', 'Failed to edit post.');
            }
        } catch (error) {
            console.error('Error editing post:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setSubmitting(false);
        }
    };    

    useEffect(() => {
        if (status === 'authenticated') {
            fetchPostDetails();
        }
    }, [status]);

    const contextValue: PostContextType = { 
        postDetails, 
        loading, 
        isOwner, 
        isLiked, 
        likePost, 
        deletePost,
        // Edit post
        editMode,
        editedTitle,
        editedContent,
        toggleEditMode,
        handleTitleChange,
        handleContentChange,
        saveEdits,
        submitting,
        // Comments
        getReplies,
        rootComments: commentsByParentId[null],
        createLocalComment,
        deleteLocalComment,
        editLocalComment,
        toggleLikeComment, 
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