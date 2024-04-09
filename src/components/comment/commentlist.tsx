"use client";

import CommentCard from './commentcard';
import { CommentValues } from '@/types/interfaces';

interface Props {
    comments: CommentValues[];
}

const CommentList: React.FC<Props> = ({ comments }) => {
    return (
        <div>
            {comments.map(comment => (
                <CommentCard 
                    key={comment.id} 
                    comment={comment}
                />
            ))}
        </div>
    );
};

export default CommentList;