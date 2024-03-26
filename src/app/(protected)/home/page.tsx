"use client";

import AllPosts from "@/components/post/allposts";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-8">All Posts</h1>
      <AllPosts />
    </>
  );
}