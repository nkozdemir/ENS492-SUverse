"use client";

import PostList from "@/components/post/postlist";
import Toast from "@/components/toast";
import { PostValues } from "@/types/interfaces";
import { useEffect, useState } from "react";

export default function CategoryDetail({ params }: { params: { slug: string[] } }) {
    const [posts, setPosts] = useState<PostValues[]>([]);
    const [loading, setLoading] = useState(true);
    const decodedCategoryName = decodeURIComponent(params.slug[1]);

    const fetchCategoryPosts = async () => {
        try {
            const res = await fetch('/api/posts/get/getAllCategoryPosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryId: params.slug[0] }),
            });
            const data = await res.json();
            console.log('Fetch category posts response:', data);
            if (data.status == 200) {
                const postsData: PostValues[] = data.data.reverse();
                //console.log('Fetched posts:', postsData);
                setPosts(postsData);
            } else {
                if (data.status !== 404) Toast('err', 'An error occurred.');
                setPosts([]);
            }
        } catch (error) {
            console.error('Error during fetching category posts:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryPosts();
    }, []);

    return (
        <>
            <h1 className="font-bold text-2xl mt-4 mb-8">{decodedCategoryName} Posts</h1>
            {loading ? (
                <div className='flex items-center justify-center'>
                    <span className="loading loading-lg"></span>
                </div>
            ) : (
                <PostList postData={posts} />
            )}
        </>
    );
}