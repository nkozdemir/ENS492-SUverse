"use client";

import PostList from "@/components/post/postlist";
import Toast from "@/components/toast";
import { isValidHexId } from "@/lib/utils";
import { PostValues } from "@/types/interfaces";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryDetail({ params }: { params: { slug: string[] } }) {
    const [posts, setPosts] = useState<PostValues[]>([]);
    const [loading, setLoading] = useState(true);
    const decodedCategoryName = decodeURIComponent(params.slug[1]);

    if (params.slug.length !== 2 || !params.slug[0] || !params.slug[1] || !isValidHexId(params.slug[0])) {
        notFound();
    }

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
            //console.log('Fetch category posts response:', data);
            if (data.status == 200) {
                const postsData: PostValues[] = data.data.reverse();
                //console.log('Fetched posts:', postsData);
                setPosts(postsData);
            } else {
                if (data.status !== 404) Toast('err', 'An error occurred.');
                setPosts([]);
            }
        } catch (error) {
            //console.error('Error during fetching category posts:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryPosts();
    }, []);

    return (
        <div>
            <h1 className="font-bold text-2xl mb-4">{decodedCategoryName} Posts</h1>
            {loading ? (
                <div className='flex flex-col gap-4 w-full'>
                    <div className="skeleton w-full h-24"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                </div>
            ) : (
                <PostList postData={posts} showingUserPosts={false} />
            )}
        </div>
    );
}