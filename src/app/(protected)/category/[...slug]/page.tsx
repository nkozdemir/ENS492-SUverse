"use client";

import PostList from "@/components/post/postlist";
import Toast from "@/components/toast";
import { PostValues } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryDetail({ params }: { params: { slug: string[] } }) {
    const [posts, setPosts] = useState<PostValues[]>([]);
    const [loading, setLoading] = useState(true);
    const decodedCategoryName = decodeURIComponent(params.slug[1]);
    const router = useRouter();

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
        <div className="mt-4">
            <button onClick={() => router.back()}>Go Back</button>
            <h1 className="font-bold text-2xl mb-8 mt-2">{decodedCategoryName} Posts</h1>
            {loading ? (
                <div className='flex flex-col gap-4 w-full'>
                    <div className="skeleton w-full h-24"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                </div>
            ) : (
                <PostList postData={posts} />
            )}
        </div>
    );
}