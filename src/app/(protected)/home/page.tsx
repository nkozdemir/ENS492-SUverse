"use client";

import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  //console.log("Session:", session);

  return (
    <>
      <h1>Home Page</h1>
      <p>Welcome, {session?.user?.name}</p>
      <p>Your email is: {session?.user?.email}</p>
      <button 
        className="btn btn-error"
        onClick={() => signOut()}
      >
        Log Out
      </button>
    </>
  );
}