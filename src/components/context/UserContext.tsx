"use client";

import { FollowValues, UserValues } from "@/types/interfaces";
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ userId: string; children: ReactNode }> = ({ userId, children }) => {
    const [userDetails, setUserDetails] = useState<UserValues>({} as UserValues);
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    
    const [followers, setFollowers] = useState<FollowValues[]>([]);
    const [showFollowers, setShowFollowers] = useState<boolean>(false);
    const [followings, setFollowings] = useState<FollowValues[]>([]);
    const [showFollowings, setShowFollowings] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    const { data: session, status } = useSession();

    const fetchUserDetails = async () => {
        try {
            const res = await fetch(`/api/user/get?userId=${userId}`);
            const data = await res.json();
            console.log('User details response:', data);
            if (data.status === 200) {
                setUserDetails(data.data);
                if (session && session.user.id === userId) {
                    setIsCurrentUser(true);
                }
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
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
                console.log('Unfollow response:', data);
                if (data.status !== 200) {
                    Toast('err', data.message);
                }
            } catch (error) {
                console.error('Error unfollowing user:', error);
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
                console.log('Follow response:', data);
                if (data.status !== 201) {
                    Toast('err', data.message);
                }
            } catch (error) {
                console.error('Error following user:', error);
                Toast('err', 'Internal server error. Please try again.');
            }
        }
    };

    const fetchFollowers = async () => {
        try {
            setFetchingData(true);
            const res = await fetch(`/api/follow/get/getAllFollowers?userId=${userId}`);
            const data = await res.json();
            console.log('Fetch followers response:', data);
            if (data.status === 200) {
                setFollowers(data.data);
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            console.error('Error fetching followers:', error);
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
            console.log('Fetch followings response:', data);
            if (data.status === 200) {
                setFollowings(data.data);
            } else {
                Toast('err', data.message);
            }
        } catch (error) {
            console.error('Error fetching followings:', error);
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