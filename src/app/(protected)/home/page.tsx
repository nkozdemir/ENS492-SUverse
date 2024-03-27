"use client";

import PostList from "@/components/post/postlist";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-8">All Posts</h1>
      <PostList apiUrl={'api/posts/getAllPosts'} />
    </>
  );
}