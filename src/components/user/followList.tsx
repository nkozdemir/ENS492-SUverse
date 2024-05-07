"use client";

import { FollowValues } from "@/types/interfaces";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import Toast from "../toast";
import Link from "next/link";
import { HiUserRemove } from "react-icons/hi";
import UserProfilePicture from "../userProfilePicture";

interface FollowListProps {
    data: FollowValues[];
    showFollowers: boolean;
}

export default function FollowList({ data, showFollowers }: FollowListProps) {
    const [listData, setListData] = useState<FollowValues[]>(data);
    const { fetchingData, isCurrentUser } = useUser();

    useEffect(() => {
        setListData(data);
    }, [data]);

    const toggleFollowInList = async (targetUser: FollowValues) => {
        if (targetUser.user.isFollowing) {
            // Unfollow
            // set the isFollowing property to false
            setListData(listData.map(user => {
                if (user.user.id === targetUser.user.id) {
                    return {
                        ...user,
                        user: {
                            ...user.user,
                            isFollowing: false,
                        }
                    };
                }
                return user;
            }));
            if (isCurrentUser) {
                // Remove the user from the list
                setListData(listData.filter(user => user.user.id !== targetUser.user.id));
            }
            try {
                const res = await fetch(`/api/follow/deleteFollow?userId=${targetUser.user.id}`, {
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
            // Follow
            // set the isFollowing property to true
            setListData(listData.map(user => {
                if (user.user.id === targetUser.user.id) {
                    return {
                        ...user,
                        user: {
                            ...user.user,
                            isFollowing: true,
                        }
                    };
                }
                return user;
            }));
            try {
                const res = await fetch(`/api/follow/createFollow?userId=${targetUser.user.id}`, {
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
    }

    const handleRemoveFollower = async (targetUser: FollowValues) => {
        // Remove the user from the list
        setListData(listData.filter(user => user.user.id !== targetUser.user.id));
        try {
            const res = await fetch(`/api/follow/removeFollower?userId=${targetUser.user.id}`, {
                method: 'POST',
            });
            const data = await res.json();
            console.log('Remove follower response:', data);
            if (data.status !== 200) {
                Toast('err', data.message);
            }
        } catch (error) {
            console.error('Error removing follower:', error);
            Toast('err', 'Internal server error. Please try again.');
        }
    }

    return (
        <div>
            {fetchingData ? (
                <div>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (!listData.length || !data.length) ? (
                <p>The list is empty.</p>
            ) : (
                <>
                    <p className="mb-4">{listData.length} {listData.length > 1 ? 'people' : 'person'}</p>
                    <div className="space-y-4">
                        {listData.map(follow => (
                            <div key={follow.user.id} className="rounded-lg shadow-lg p-4 flex items-center space-x-4">
                                <Link href={`/user/${follow.user.id}`}>
                                    <div className="flex items-center space-x-4">
                                        <UserProfilePicture imageUrl={follow.user.profilePic} size={16} />
                                        <div>
                                            <p className="font-semibold">{follow.user.name}</p>
                                            <p>@{follow.user.username}</p>
                                        </div>
                                    </div>
                                </Link>
                                {!follow.user.isCurrentUser && (
                                    <div>
                                        <button 
                                            onClick={() => toggleFollowInList(follow)}
                                            className={`btn ${follow.user.isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                                        >
                                            {follow.user.isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                    </div>
                                )}
                                {showFollowers && isCurrentUser && (
                                    <div>
                                        <button 
                                            className="btn btn-error btn-circle"
                                            onClick={() => handleRemoveFollower(follow)}
                                        >
                                            <HiUserRemove size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>  
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}