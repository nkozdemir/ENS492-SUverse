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

    const handleClear = () => {
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                required
                rows={2}
                className="textarea textarea-bordered col-span-2 mr-8 mb-2"
            />
            <div className="flex">
                <button 
                    type="button" 
                    onClick={handleClear}
                    disabled={submitting || !content}
                    className={`btn btn-ghost w-24 mr-2 ${submitting ? 'btn-disabled' : ''}`}
                >
                    Clear
                </button>
                <button 
                    type="submit" 
                    disabled={submitting || !content || content === initialContent}
                    className={`btn btn-primary ${submitting ? 'btn-disabled' : ''} w-24`}
                >
                    {submitting ? (
                        <>
                            <span className="animate-spin mr-2">&#9696;</span>
                            Submitting
                        </>
                    ) : 'Submit'}
                </button>
            </div>
        </form>
    )
}
