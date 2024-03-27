"use client";

import PostList from "@/components/post/postlist";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-8">All Posts</h1>
      <PostList 
        apiEndpoint={'/api/posts/get/getAllPosts'} 
        requestOptions={{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }}
      />
    </>
  );
}