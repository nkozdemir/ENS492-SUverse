"use client";

import { useState } from "react";

export default function CommentForm({ 
    onSubmit,
    submitting,
    initialContent = '', 
}: {
    onSubmit: (content: string) => Promise<void>;
    submitting: boolean;
    initialContent: string;
}) {
    const [content, setContent] = useState(initialContent);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onSubmit(content).then(() => setContent(''));
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                required
                className="textarea textarea-bordered mr-4 w-1/2"
            />
            <button 
                type="submit" 
                disabled={submitting}
                className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`}
            >
                {submitting ? (
                    <>
                        <span className="animate-spin mr-2">&#9696;</span>
                        Submitting
                    </>
                ) : 'Submit'}
            </button>
        </form>
    )
}