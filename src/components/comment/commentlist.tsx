"use client";

import Comment from './comment';
import { CommentValues } from '@/types/interfaces';

interface Props {
    comments: CommentValues[];
}

const CommentList: React.FC<Props> = ({ comments }) => {
    return (
        <>
            <div>
                {comments.map(comment => (
                    <Comment 
                        key={comment.id} 
                        comment={comment}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentList;