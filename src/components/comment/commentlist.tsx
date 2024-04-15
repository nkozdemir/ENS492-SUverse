"use client";

import { useEffect, useState } from 'react';
import CommentCard from './commentcard';
import { CommentValues } from '@/types/interfaces';
import Toast from '../toast';

interface Props {
    comments: CommentValues[];
    postId: string;
    setLoadingComments: React.Dispatch<React.SetStateAction<boolean>>;
    setPostComments: React.Dispatch<React.SetStateAction<CommentValues[]>>;
}

interface CommentLikeValues {
    id: string;
    userId: string;
    commentId: string;
    comment: CommentValues;
    createdAt: Date;
    updatedAt: Date;
}

const CommentList: React.FC<Props> = ({ comments, postId, setLoadingComments, setPostComments }) => {
    const [userLikes, setUserLikes] = useState<CommentLikeValues[]>([]);
    const [userComments, setUserComments] = useState<CommentValues[]>([]);

    const fetchUserLikes = async () => {
        try {
            const response = await fetch(`/api/comments/get/getAllLikedCommentsInPost?postId=${postId}`);
            const data = await response.json();
            console.log('Fetch user comment likes data: ', data);
            if (data.status === 200) {
                setUserLikes(data.data);
            } else {
                if (data.status !== 404) 
                    Toast('err', 'An error occurred while fetching user comment likes');
                setUserLikes([]);
            }
        } catch (error) {
            console.error('Error fetching user comment likes:', error);
            setUserLikes([]);
        }
    }

    const fetchUserComments = async () => {
        try {
            const response = await fetch(`/api/comments/get/getAllUserCommentsInPost?postId=${postId}`);
            const data = await response.json();
            console.log('Fetch user comments data: ', data);
            if (data.status === 200) {
                setUserComments(data.data);
            } else {
                if (data.status !== 404) 
                    Toast('err', 'Error fetching user comments');
                setUserComments([]);
            }
        } catch (error) {
            console.error('Error fetching user comments:', error);
            setUserComments([]);
        }
    }   
    
    const handleLike = async (commentId: string) => {
        if (userLikes.some(like => like.commentId === commentId)) {
            // Unlike the comment locally
            setUserLikes(prevUserLikes => prevUserLikes.filter(like => like.commentId !== commentId));
            // Update the likeCount of the comment
            setPostComments(prevComments => prevComments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likeCount: comment.likeCount - 1,
                    };
                }
                return comment;
            }));
            try {
                const response = await fetch('/api/comments/like/deleteLike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ commentId }),
                });
                const data = await response.json();
                console.log('Delete like data: ', data);
                if (data.status === 200) {
                    console.log('Comment like deleted');
                } else {
                    if (data.status !== 404) 
                        Toast('err', 'Error unliking comment');
                }
            } catch (error) {
                console.error('Error deleting comment like: ', error);
            }
        } else {
            // Like the comment locally
            setUserLikes(prevUserLikes => [...prevUserLikes, { commentId } as CommentLikeValues]);
            // Update the likeCount of the comment
            setPostComments(prevComments => prevComments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likeCount: comment.likeCount + 1,
                    };
                }
                return comment;
            }));
            try {
                const response = await fetch('/api/comments/like/createLike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ commentId }),
                });
                const data = await response.json();
                console.log('Create like data: ', data);
                if (data.status === 201) {
                    console.log('Comment like created');
                } else {
                    if (data.status !== 404) 
                        Toast('err', 'Error liking comment');
                }
            } catch (error) {
                console.error('Error creating comment like: ', error);
            }
        }
    }; 

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchUserLikes(), fetchUserComments()]);
            setLoadingComments(false);
        };
        fetchData();
    }, []);

    return (
        <>
            <div>
                {comments.map(comment => (
                    <CommentCard 
                        key={comment.id} 
                        comment={comment}
                        isLiked={userLikes.some(like => like.commentId === comment.id)}
                        isOwner={userComments.some(userComment => userComment.id === comment.id)}
                        onLike={() => handleLike(comment.id)}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentList;