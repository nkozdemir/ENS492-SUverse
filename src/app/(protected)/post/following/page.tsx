"use client";

import PostList from "@/components/post/postlist";
import Toast from "@/components/toast";
import { PostValues } from "@/types/interfaces";
import { useEffect, useState } from "react";

export default function FollowingPosts() {
  const [posts, setPosts] = useState<PostValues[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPosts = async () => {
    try {
      const res = await fetch('/api/posts/get/getAllFollowingPosts');
      const data = await res.json();
      console.log('Fetch all posts response:', data);
      if (data.status == 200) {
        const postsData: PostValues[] = data.data.reverse();
        //console.log('Fetched posts:', postsData);
        setPosts(postsData);
      } else {
        if (data.status !== 404) Toast('err', 'An error occurred.');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error during fetching all posts:', error);
      Toast('err', 'Internal server error.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <>
      <h1 className="font-bold text-2xl mb-4">Following</h1>
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
    </>
  );
}