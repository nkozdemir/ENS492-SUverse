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
            if (isCurrentUser && !showFollowers) {
                setListData(listData.filter(user => user.user.id !== targetUser.user.id));
            }
            try {
                const res = await fetch(`/api/follow/deleteFollow?userId=${targetUser.user.id}`, {
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
            // Follow
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
                //console.log('Follow response:', data);
                if (data.status !== 201) {
                    Toast('err', data.message);
                }
            } catch (error) {
                //console.error('Error following user:', error);
                Toast('err', 'Internal server error. Please try again.');
            }
        }
    }

    const handleRemoveFollower = async (targetUser: FollowValues) => {
        setListData(listData.filter(user => user.user.id !== targetUser.user.id));
        try {
            const res = await fetch(`/api/follow/removeFollower?userId=${targetUser.user.id}`, {
                method: 'POST',
            });
            const data = await res.json();
            //console.log('Remove follower response:', data);
            if (data.status !== 200) {
                Toast('err', data.message);
            }
        } catch (error) {
            //console.error('Error removing follower:', error);
            Toast('err', 'Internal server error. Please try again.');
        }
    }

    return (
        <div>
            {fetchingData ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (!listData.length || !data.length) ? (
                <p>The list is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {listData.map(follow => (
                            <div key={follow.user.id} className="rounded-lg shadow-lg p-2 flex flex-wrap items-center justify-between lg:space-x-8 bg-base-200 space-x-1">
                                <Link href={`/user/${follow.user.id}`} className="flex items-center space-x-4">
                                    <UserProfilePicture imageUrl={follow.user.profilePic} size={50} />
                                    <div>
                                        <p className="font-semibold">{follow.user.name}</p>
                                        <p>@{follow.user.username}</p>
                                    </div>
                                </Link>
                                <div className="flex space-x-2 mt-2 lg:mt-0">
                                    {!follow.user.isCurrentUser && (
                                        <button 
                                            onClick={() => toggleFollowInList(follow)}
                                            className={`btn ${follow.user.isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                                        >
                                            {follow.user.isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                    )}
                                    {showFollowers && isCurrentUser && (
                                        <button 
                                            className="btn btn-error btn-circle"
                                            onClick={() => handleRemoveFollower(follow)}
                                        >
                                            <HiUserRemove size={24} />
                                        </button>
                                    )}
                                </div>
                            </div>  
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
