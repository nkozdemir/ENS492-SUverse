"use client";

import PostList from "@/components/post/postlist";

export default function CategoryDetail({ params }: { params: { slug: string[] } }) {
    const decodedCategoryName = decodeURIComponent(params.slug[1]);

    return (
        <>
            <h1 className="font-bold text-2xl mt-4 mb-8">{decodedCategoryName} Posts</h1>
            <PostList 
                apiEndpoint={'/api/posts/getAllCategoryPosts'} 
                requestOptions={{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ categoryId: params.slug[0] }),
                }} 
            />
        </>
    );
}