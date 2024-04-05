"use client";

import PostList from "@/components/post/postlist";
import Toast from "@/components/toast";
import { PostValues } from "@/types/interfaces";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<PostValues[]>([]);

  const fetchAllPosts = async () => {
    try {
      const res = await fetch('/api/posts/get/getAllPosts');
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
    }
  }

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-8">All Posts</h1>
      <PostList postData={posts}/>
    </>
  );
}