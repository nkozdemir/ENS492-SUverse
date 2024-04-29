"use client";

import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { UserProvider, useUser } from "../context/UserContext";
import { useRouter } from 'next/navigation';

const UserDetailPage = ({ userId }: { userId: string }) => {
    return (
        <UserProvider userId={userId as string}>
            <UserDetails />
        </UserProvider>
    );
}

const UserDetails = () => {
    const { userDetails, loading, isCurrentUser, toggleFollow } = useUser();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex flex-col gap-4 w-full mt-8">
                <div className="skeleton w-full h-64"></div>
                <div className="skeleton w-full h-24"></div>
                <div className="skeleton w-full h-96"></div>
            </div>
        );
    }

    if (!userDetails) {
        return <h1>No user found.</h1>;
    }

    return (
        <div className='mt-4'>
            <button onClick={() => router.back()}>Go Back</button>
            <h1 className="text-2xl font-bold mb-8 mt-2">User Profile</h1>
            <div>
                <div className="flex items-center space-x-4">
                    <div className="avatar placeholder mr-4">
                        <div className="rounded-full w-16">
                            <Image src={'/default-profile-img.png'} alt={'userImage'} width={48} height={48} className="rounded-full" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{userDetails.name}</h2>
                        <p className="text-gray-600">@{userDetails.username}</p>
                        <p className="text-gray-600">{userDetails.tag}</p>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <p className="font-semibold">{userDetails.followerCount}</p>
                            <p className="text-gray-600">Followers</p>
                        </div>
                        <div className="mx-4">
                            <p className="font-semibold">{userDetails.followingCount}</p>
                            <p className="text-gray-600">Following</p>
                        </div>
                        {!isCurrentUser && (
                            <button 
                                onClick={() => toggleFollow(userDetails.id)}
                                className={`btn ${userDetails.isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                            >
                                {userDetails.isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                </div>
                <p className="mt-4">{userDetails.bio || 'User Bio'}</p>
                <p className="text-gray-600 mt-2">Joined: {formatDate(new Date(userDetails.createdAt))}</p>
            </div>
        </div>
    );
}

export default UserDetailPage;