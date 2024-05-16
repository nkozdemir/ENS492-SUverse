"use client";

import { formatDate } from '@/lib/utils';
import { UserProvider, useUser } from "../context/UserContext";
import FollowList from './followList';
import { useEffect, useState } from 'react';
import PostList from '../post/postlist';
import CommentProfileList from '../comment/commentProfileList';
import ImageUpload from '../upload/imageUpload';
import UserProfilePicture from '../userProfilePicture';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";

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
    
    const [activeTab, setActiveTab] = useState('createdPosts');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [showImage, setShowImage] = useState<boolean>(true);

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

    const handleImageRemove = () => {
        setUploadedImageUrl('');
    };

    const handleRemoveImage = () => {
        //const imageKey = userDetails.profilePic.split('/').pop() as string;
        //removeImage(imageKey);
        // Reset both imageUrl and imageKey to empty strings
        setUploadedImageUrl('');
        setShowImage(false);
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
                <h1 className="text-2xl font-bold mb-8">User Profile</h1>
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
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold">
                        Followers
                    </h2>
                    <button onClick={toggleViewFollowers} className='btn btn-ghost btn-circle bg-base-200'>
                        <IoMdClose size={24} />
                    </button>
                </div>
                <FollowList data={followers} showFollowers={true} />
            </div>
        );
    }

    // Render followings list if requested
    if (showFollowings) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold">Following</h2>
                    <button onClick={toggleViewFollowings} className='btn btn-ghost btn-circle bg-base-200'>
                        <IoMdClose size={24} />
                    </button>
                </div>
                <FollowList data={followings} showFollowers={false} />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">User Profile</h1>
            
            {/* User Details */}
            <div className='bg-base-200 p-4 rounded-lg shadow-lg'>
            <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-4">
                <UserProfilePicture imageUrl={userDetails.profilePic} size={100} />
                <div className='mt-4 lg:mt-0'>
                    <h2 className="text-xl font-semibold">{userDetails.name}</h2>
                    <p className="text-gray-600 mb-2">@{userDetails.username}</p>
                    <p className="text-gray-600">{userDetails.tag}</p>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
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
                <div className='my-4'>
                    <p className="mb-4">{userDetails.bio}</p>
                    {isCurrentUser && (
                        <button className="font-bold text-md underline text-primary" onClick={toggleEditMode}>
                            Edit
                        </button>
                    )}
                </div>
            )}
            {editMode && (
                <div className='my-8 flex flex-col lg:flex-row items-start'>
                    {/* Editable profile picture */}
                    <div className="mb-4 mr-4">
                        {/* Rendering uploaded image */}
                        {userDetails.profilePic.length && showImage ? (
                            <div className="flex flex-col items-center justify-center mr-4 mb-4 lg:mb-0">
                                <p className="text-lg font-semibold mb-4">Your profile pic:</p>
                                <div className="relative">
                                    <Image src={userDetails.profilePic} alt="Uploaded image" width={100} height={100} className="rounded-lg" />
                                </div>
                                <button
                                    onClick={handleRemoveImage}
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none mt-4"
                                >
                                    Remove Image
                                </button>
                            </div>
                        ) : <ImageUpload onImageUpload={handleImageUpload} onImageRemove={handleImageRemove} /> }
                    </div>
                    {/* Editable bio */}
                    <div className="flex flex-col lg:mr-2 w-full">
                        <textarea
                            value={editedBio}
                            onChange={(e) => handleBioChange(e.target.value)}
                            rows={2}
                            className="textarea mb-4"
                            placeholder="Enter bio..."
                        />
                        {/* Save, Cancel, Clear buttons */}
                        <div className="lg:flex lg:justify-end justify-center space-x-4">
                            <button 
                                onClick={() => {saveEdits(uploadedImageUrl)}}
                                disabled={submitting || (editedBio === userDetails.bio && !uploadedImageUrl)}
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
                                onClick={() => {
                                    toggleEditMode();
                                    setShowImage(true);
                                }}
                                disabled={submitting || uploadedImageUrl.length !== 0}
                                className={`btn btn-ghost btn-outline ${submitting ? 'btn-disabled' : ''}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleBioChange('')}
                                disabled={submitting || !editedBio}
                                className={`btn btn-ghost btn-outline ${submitting ? 'btn-disabled' : ''}`}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-gray-600 mt-2">Joined: {formatDate(new Date(userDetails.createdAt))}</p>
            </div>

            {/* Tabbed View */}
            <div className="mt-4">
                <select
                    className="select select-primary w-full max-w-xs"
                    value={activeTab}
                    onChange={(e) => handleTabChange(e.target.value)}
                >
                    <option value="createdPosts">Posts {activeTab === 'createdPosts' && `(${userCreatedPosts.length})`}</option>
                    <option value="likedPosts">Liked Posts {activeTab === 'likedPosts' && `(${userLikedPosts.length})`}</option>
                    <option value="createdComments">Comments {activeTab === 'createdComments' && `(${userCreatedComments.length})`}</option>
                    <option value="likedComments">Liked Comments {activeTab === 'likedComments' && `(${userLikedComments.length})`}</option>
                </select>
                <div className="mt-4">
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