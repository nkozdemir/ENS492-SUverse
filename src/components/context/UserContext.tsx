"use client";

import { CommentValues, FollowValues, PostValues, UserValues } from "@/types/interfaces";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Toast from "../toast";
import { useSession } from "next-auth/react";

interface UserContextType {
    userDetails: UserValues;
    isCurrentUser: boolean;
    loading: boolean;
    fetchingData: boolean;
    // Follow
    toggleFollow: (targetUserId: string) => void;
    // Followers
    followers: FollowValues[];
    toggleViewFollowers: () => void;
    showFollowers: boolean;
    // Followings
    followings: FollowValues[];
    toggleViewFollowings: () => void;
    showFollowings: boolean;
    // Edit
    editMode: boolean;
    editedBio: string;
    toggleEditMode: () => void;
    handleBioChange: (value: string) => void;
    saveEdits: (imageUrl: string) => Promise<void>;
    submitting: boolean;
    // Posts
    userCreatedPosts: PostValues[];
    fetchUserCreatedPosts: () => void;
    userLikedPosts: PostValues[];
    fetchUserLikedPosts: () => void;
    fetchingPostData: boolean;
    // Comments
    userCreatedComments: CommentValues[];
    fetchUserCreatedComments: () => void;
    userLikedComments: CommentValues[];
    fetchUserLikedComments: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ userId: string; children: ReactNode }> = ({ userId, children }) => {
    const [userDetails, setUserDetails] = useState<UserValues>({} as UserValues);
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    
    const [followers, setFollowers] = useState<FollowValues[]>([]);
    const [showFollowers, setShowFollowers] = useState<boolean>(false);
    const [followings, setFollowings] = useState<FollowValues[]>([]);
    const [showFollowings, setShowFollowings] = useState<boolean>(false);

    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedBio, setEditedBio] = useState<string>('');

    const [userCreatedPosts, setUserCreatedPosts] = useState<PostValues[]>([]);
    const [userLikedPosts, setUserLikedPosts] = useState<PostValues[]>([]);
    const [userCreatedComments, setUserCreatedComments] = useState<CommentValues[]>([]);
    const [userLikedComments, setUserLikedComments] = useState<CommentValues[]>([]);
    const [fetchingPostData, setFetchingPostData] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const { data: session, status, update } = useSession();

    const fetchUserDetails = async () => {
        try {
            const res = await fetch(`/api/user/get?userId=${userId}`);
            const data = await res.json();
            //console.log('User details response:', data);
            if (data.status === 200) {
                if (session && session.user.id === userId) {
                    setIsCurrentUser(true);
                }
                setUserDetails(data.data);
                setEditedBio(data.data.bio);
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            //console.error('Error fetching user details:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async (targetUserId: string) => {
        if (isCurrentUser) return Toast('err', 'You cannot follow yourself');
        if (userDetails.isFollowing) {
            // Unfollow the user
            setUserDetails((prev) => ({ ...prev, isFollowing: false }));
            setUserDetails((prev) => ({ ...prev, followerCount: prev.followerCount - 1 }));
            try {
                const res = await fetch(`/api/follow/deleteFollow?userId=${targetUserId}`, {
                    method: 'POST',
                });
                const data = await res.json();
                //console.log('Unfollow response:', data);
                if (data.status !== 200) {
                    Toast('err', data.message);
                }
            } catch (error) {
                //console.error('Error unfollowing user:', error);
                Toast('err', 'Internal server error. Please try again.');
            }
        } else {
            // Follow the user
            setUserDetails((prev) => ({ ...prev, isFollowing: true }));
            setUserDetails((prev) => ({ ...prev, followerCount: prev.followerCount + 1 }));
            try {
                const res = await fetch(`/api/follow/createFollow?userId=${targetUserId}`, {
                    method: 'POST',
                });
                const data = await res.json();
                //console.log('Follow response:', data);
                if (data.status !== 201) {
                    Toast('err', data.message);
                }
            } catch (error) {
                //console.error('Error following user:', error);
                Toast('err', 'Internal server error. Please try again.');
            }
        }
    };

    const fetchFollowers = async () => {
        try {
            setFetchingData(true);
            const res = await fetch(`/api/follow/get/getAllFollowers?userId=${userId}`);
            const data = await res.json();
            //console.log('Fetch followers response:', data);
            if (data.status === 200) {
                setFollowers(data.data);
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            //console.error('Error fetching followers:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setFetchingData(false);
        }
    }

    const toggleViewFollowers = () => {
        // If the followers list is closed, open it
        if (!showFollowers) {
            setShowFollowers(true);
            if (!followers.length)
                fetchFollowers();
        }
        // If the followers list is open, close it
        else {
            setShowFollowers(false);
            fetchFollowers();
            fetchFollowings();
            fetchUserDetails();
        }
    }

    const fetchFollowings = async () => {
        try {
            setFetchingData(true);
            const res = await fetch(`/api/follow/get/getAllFollowings?userId=${userId}`);
            const data = await res.json();
            //console.log('Fetch followings response:', data);
            if (data.status === 200) {
                setFollowings(data.data);
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            //console.error('Error fetching followings:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setFetchingData(false);
        }
    }

    const toggleViewFollowings = () => {
        // If the followings list is closed, open it
        if (!showFollowings) {
            setShowFollowings(true);
            if (!followings.length)
                fetchFollowings();
        }
        // If the followings list is open, close it
        else {
            setShowFollowings(false);
            fetchFollowings();
            fetchFollowers();
            fetchUserDetails();
        }
    }

    const toggleEditMode = () => {
        setEditedBio(userDetails.bio);
        setEditMode(!editMode);
    }

    const handleBioChange = (value: string) => {
        setEditedBio(value);
    }

    const saveEdits = async (imageUrl:string) => {
        if (!isCurrentUser) return Toast('err', 'You are not authorized to edit this profile');
        try {
            setSubmitting(true);
            const res = await fetch(`/api/profile/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    bio: editedBio,
                    profilePic: imageUrl,
                }),
            });
            const data = await res.json();
            //console.log('Save edits response:', data);
            if (data.status === 200) {
                // Update bio locally
                setUserDetails((prev) => ({ ...prev, bio: editedBio, profilePic: imageUrl}));
                update({ bio: editedBio, profilePic: imageUrl});
                Toast('ok', 'Profile updated successfully');
                toggleEditMode();
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            //console.error('Error saving edits:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const fetchUserCreatedPosts = async () => {
        try {
            setFetchingPostData(true);
            const res = await fetch(`/api/posts/get/user?userId=${userId}`);
            const data = await res.json();
            //console.log('User created posts response:', data);
            if (data.status === 200) {
                setUserCreatedPosts(data.data);
            } else {
                if (data.status !== 404) Toast('err', data.message);
                else setUserCreatedPosts([]);
            }
        } catch (error) {
            //console.error('Error fetching user created posts:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setFetchingPostData(false);
        }
    }

    const fetchUserLikedPosts = async () => {
        try {
            setFetchingPostData(true);
            const res = await fetch(`/api/posts/get/liked?userId=${userId}`);
            const data = await res.json();
            //console.log('User liked posts response:', data);
            if (data.status === 200) {
                setUserLikedPosts(data.data);
            } else {
                if (data.status !== 404) Toast('err', data.message);
                else setUserLikedPosts([]);
            }
        } catch (error) {
            //console.error('Error fetching user liked posts:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setFetchingPostData(false);
        }
    }

    const fetchUserCreatedComments = async () => {
        try {
            setFetchingPostData(true);
            const res = await fetch(`/api/comments/get/getAllUserComments?userId=${userId}`);
            const data = await res.json();
            //console.log('User created comments response:', data);
            if (data.status === 200) {
                setUserCreatedComments(data.data);
            } else {
                if (data.status !== 404) Toast('err', data.message);
                else setUserCreatedComments([]);
            }
        } catch (error) {
            //console.error('Error fetching user created comments:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setFetchingPostData(false);
        }
    }

    const fetchUserLikedComments = async () => {
        try {
            setFetchingPostData(true);
            const res = await fetch(`/api/comments/get/getAllUserLikedComments?userId=${userId}`);
            const data = await res.json();
            //console.log('User liked comments response:', data);
            if (data.status === 200) {
                // For each value in data.data, get only comment field
                const likedComments = data.data.map((value: any) => value.comment);
                //console.log('Liked comments:', likedComments);
                setUserLikedComments(likedComments);
            } else {
                if (data.status !== 404) Toast('err', data.message);
                else setUserLikedComments([]);
            }
        } catch (error) {
            //console.error('Error fetching user liked comments:', error);
            Toast('err', 'Internal server error. Please try again.');
        } finally {
            setFetchingPostData(false);
        }
    }

    useEffect(() => {
        if (status === 'authenticated') {
            fetchUserDetails();
        }
    }, [status]);

    const contextValue: UserContextType = {
        userDetails,
        isCurrentUser,
        loading,
        fetchingData,
        // Follow
        toggleFollow,
        // Followers
        followers,
        toggleViewFollowers,
        showFollowers,
        // Followings
        followings,
        toggleViewFollowings,
        showFollowings,
        // Edit
        editMode,
        editedBio,
        toggleEditMode,
        handleBioChange,
        saveEdits,
        submitting,
        // Posts
        userCreatedPosts,
        fetchUserCreatedPosts,
        userLikedPosts,
        fetchUserLikedPosts,
        fetchingPostData,
        // Comments
        userCreatedComments,
        fetchUserCreatedComments,
        userLikedComments,
        fetchUserLikedComments,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) throw new Error('useUser must be used within a UserProvider');
    return context;
}