"use client";
import { useSession } from 'next-auth/react';

export default function Profile() {
    const { data: session } = useSession();
    //console.log("Session:", session);
    
    return (
        <>
            <div>
                <h1 className='text-2xl font-bold mt-4 mb-8'>Profile Page</h1>
                <p>Welcome, {session?.user?.name}</p>
                <p>Your email is: {session?.user?.email}</p>
            </div>
        </>
    );
}