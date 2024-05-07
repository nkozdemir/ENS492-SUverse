"use client";

import { formatDate } from '@/lib/utils';
import { UserProvider, useUser } from "../context/UserContext";
import { useRouter } from 'next/navigation';
import FollowList from './followList';
import { useEffect, useState } from 'react';
import PostList from '../post/postlist';
import CommentProfileList from '../comment/commentProfileList';
import ImageUpload from '../upload/imageUpload';
import UserProfilePicture from '../userProfilePicture';

const UserDetailPage = ({ userId }: { userId: string }) => {
    return (
        <UserProvider userId={userId as string}>
            <UserDetails />
        </UserProvider>
    );
}

const UserDetails = () => {
    const { userDetails, loading, isCurrentUser, toggleFollow, followers, showFollowers, toggleViewFollowers, followings, showFollowings,
         toggleViewFollowings, editMode, toggleEditMode, editedBio, handleBioChange, saveEdits, submitting, fetchUserCreatedPosts,
         userCreatedPosts, fetchUserLikedPosts, userLikedPosts, fetchingPostData, userCreatedComments, fetchUserCreatedComments, 
         userLikedComments, fetchUserLikedComments } = useUser();
    
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('createdPosts');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

    useEffect(() => {
        if (activeTab === 'createdPosts') {
            fetchUserCreatedPosts();
        } else if (activeTab === 'likedPosts') {
            fetchUserLikedPosts();
        } else if (activeTab === 'createdComments') {
            fetchUserCreatedComments();
        } else if (activeTab === 'likedComments') {
            fetchUserLikedComments();
        } else {
            console.error('Invalid tab selected.');
        }
    }, [activeTab]);

    const handleTabChange = (tab: string) => { 
        setActiveTab(tab);
    }

    const handleImageUpload = (imageUrl: string) => {
        setUploadedImageUrl(imageUrl);
    };

    let tabContent;
    switch (activeTab) {
        case 'createdPosts':
            tabContent = <PostList postData={userCreatedPosts} showingUserPosts={true} />;
            break;
        case 'likedPosts':
            tabContent = <PostList postData={userLikedPosts} showingUserPosts={false} />;
            break;
        case 'createdComments':
            tabContent = <CommentProfileList comments={userCreatedComments} showingUserComments={true} />; 
            break;
        case 'likedComments':
            tabContent = <CommentProfileList comments={userLikedComments} showingUserComments={false} />; 
            break;
        default:
            tabContent = null;
    }

    if (loading) {
        return (
            <>
                <h1 className="text-2xl font-bold my-8">User Profile</h1>
                <div className="flex flex-col gap-4 w-full">
                    <div className="skeleton w-full h-64"></div>
                    <div className="skeleton w-full h-12"></div>
                    <div className="skeleton w-full h-32"></div>
                    <div className="skeleton w-full h-44"></div>
                    <div className="skeleton w-full h-44"></div>
                </div>
            </>
        );
    }

    if (!userDetails) {
        return <h1>No user found.</h1>;
    }

    // Render followers list if requested
    if (showFollowers) {
        return (
            <div className='mt-4'>
                <button onClick={toggleViewFollowers}>Close</button>
                <h2 className="text-xl font-semibold mt-2 mb-8">Followers</h2>
                <FollowList data={followers} showFollowers={true} />
            </div>
        );
    }

    // Render followings list if requested
    if (showFollowings) {
        return (
            <div className='mt-4'>
                <button onClick={toggleViewFollowings}>Close</button>
                <h2 className="text-xl font-semibold mt-2 mb-8">Followings</h2>
                <FollowList data={followings} showFollowers={false} />
            </div>
        );
    }

    return (
        <div className='mt-4'>
            <button onClick={() => router.back()} className="mb-2">Go Back</button>
            <h1 className="text-2xl font-bold mb-8">User Profile</h1>
            
            {/* User Details */}
            <div className='bg-base-200 p-4 rounded-lg shadow-lg'>
                <div className="flex items-center space-x-4">
                    <UserProfilePicture imageUrl={userDetails.profilePic} size={100} />
                    <div>
                        <h2 className="text-xl font-semibold">{userDetails.name}</h2>
                        <p className="text-gray-600">@{userDetails.username}</p>
                        <p className="text-gray-600">{userDetails.tag}</p>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <p className="font-semibold">{userDetails.followerCount}</p>
                            <button 
                                className="text-gray-600"
                                onClick={toggleViewFollowers}
                            >
                                Followers
                            </button>
                        </div>
                        <div className="mx-4">
                            <p className="font-semibold">{userDetails.followingCount}</p>
                            <button 
                                className="text-gray-600"
                                onClick={toggleViewFollowings}
                            >
                                Following
                            </button>
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
                {!editMode && (
                    <div className='mt-4'>
                        <p className="mb-8">{userDetails.bio}</p>
                        {isCurrentUser && (
                            <p className="text-gray-600 cursor-pointer" onClick={toggleEditMode}>
                                Edit
                            </p>
                        )}
                    </div>
                )}
                {editMode && (
                    <div className='my-8 flex'>
                        <div className="mb-4 mr-4">
                            <ImageUpload onImageUpload={handleImageUpload} />
                        </div>
                        <textarea
                            value={editedBio}
                            onChange={(e) => handleBioChange(e.target.value)}
                            rows={2}
                            className="textarea mb-2 mr-2"
                            placeholder="Enter bio..."
                        />
                        <div className="ml-2">
                            <button 
                                onClick={() => saveEdits(uploadedImageUrl)}
                                disabled={submitting || (!editedBio && !uploadedImageUrl) || (editedBio === userDetails.bio && !uploadedImageUrl)}
                                className={`btn ${submitting ? 'btn-disabled' : 'btn-primary'}`}
                            >
                                {submitting ? (
                                    <>
                                        <span className="animate-spin mr-2">&#9696;</span>
                                        Saving...
                                    </>
                                ) : 'Save'}
                            </button>
                            <button
                                onClick={toggleEditMode}
                                disabled={submitting}
                                className={`btn btn-ghost ml-2 ${submitting ? 'btn-disabled' : ''}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleBioChange('')}
                                disabled={submitting || !editedBio}
                                className={`btn btn-ghost ml-2 ${submitting ? 'btn-disabled' : ''}`}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
                <p className="text-gray-600 mt-2">Joined: {formatDate(new Date(userDetails.createdAt))}</p>
            </div>

            {/* Tabbed View */}
            <div className="mt-8">
                <div role="tablist" className="tabs tabs-boxed">
                    <a role="tab" className={`tab ${activeTab === 'createdPosts' ? 'tab-active' : ''}`} onClick={() => handleTabChange('createdPosts')}>
                        User Posts {activeTab === 'createdPosts' ? `(${userCreatedPosts.length})` : ''}
                    </a>
                    <a role="tab" className={`tab ${activeTab === 'likedPosts' ? 'tab-active' : ''}`} onClick={() => handleTabChange('likedPosts')}>
                        Liked Posts {activeTab === 'likedPosts' ? `(${userLikedPosts.length})` : ''}
                    </a>
                    <a role="tab" className={`tab ${activeTab === 'createdComments' ? 'tab-active' : ''}`} onClick={() => handleTabChange('createdComments')}>
                        User Comments {activeTab === 'createdComments' ? `(${userCreatedComments.length})` : ''}
                    </a>
                    <a role="tab" className={`tab ${activeTab === 'likedComments' ? 'tab-active' : ''}`} onClick={() => handleTabChange('likedComments')}>
                        Liked Comments {activeTab === 'likedComments' ? `(${userLikedComments.length})` : ''}
                    </a>
                </div>
                <div className="mt-8">
                    {fetchingPostData ? (
                        <div className='flex items-center justify-center'>
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        tabContent
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetailPage;