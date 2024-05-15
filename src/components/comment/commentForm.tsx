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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                required
                rows={2}
                className="textarea textarea-bordered col-span-1 sm:col-span-2 mr-0 sm:mr-8 mb-4 lg:mb-0"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 lg:space-y-0 lg:space-x-4 space-x-0">
                <button 
                    type="submit" 
                    disabled={submitting || !content || content === initialContent}
                    className={`btn btn-primary w-full sm:w-24 ${submitting ? 'btn-disabled' : ''}`}
                >
                    {submitting ? (
                        <>
                            <span className="animate-spin mr-2">&#9696;</span>
                            Submitting
                        </>
                    ) : 'Submit'}
                </button>
                <button 
                    type="button" 
                    onClick={handleClear}
                    disabled={submitting || !content}
                    className={`btn btn-ghost w-full sm:w-24 mr-2 sm:mr-0 ${submitting ? 'btn-disabled' : ''}`}
                >
                    Clear
                </button>
            </div>
        </form>
    )
}
