/* 
TODO:
- Add profile edit functionality
- Add profile picture
- Add follow/unfollow functionality
*/

"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/toast";
import { formatDate } from '@/lib/utils';
import PostList from "@/components/post/postlist";
import { PostValues, UserValues } from "@/types/interfaces";
import { useSession } from "next-auth/react";

export default function User({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<UserValues>();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('created'); 
    const [tabContent, setTabContent] = useState<PostValues[]>([]);
    const { data: session, status } = useSession();

    const getUser = async () => {
        try {
            const response = await fetch(`/api/user/get?userId=${params.id}`);
            const data = await response.json();
            console.log('Fetch user data response:', data)
            const userData = data.data;
            console.log('User data:', userData);
            setUser(userData); 
        } catch (error) {
            console.error("Error fetching user:", error);
            Toast('err', 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const fetchCreatedPosts = async () => {
        try {
            const response = await fetch(`/api/posts/get/user?userId=${params.id}`);
            const data = await response.json();

            if (data.status === 200) {
                const postsData: PostValues[] = data.data.reverse();
                setTabContent(postsData);
            } else {
                if (data.status !== 404) Toast('err', 'An error occurred.');
                setTabContent([]);
            }
        } catch (error) {
            console.error('Error fetching created posts:', error);
            Toast('err', 'Internal server error.');
        }
    }

    const fetchLikedPosts = async () => {
        try {
            const response = await fetch(`/api/posts/get/liked?userId=${params.id}`);
            const data = await response.json();

            if (data.status === 200) {
                const postsData: PostValues[] = data.data.reverse();
                setTabContent(postsData);
            } else {
                if (data.status !== 404) Toast('err', 'An error occurred.');
                setTabContent([]);
            }
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            Toast('err', 'Internal server error.');
        }
    }

    useEffect(() => {
        if (activeTab === 'created') fetchCreatedPosts();
        if (activeTab === 'liked') fetchLikedPosts();
    }, [activeTab]);

    useEffect(() => {
        if (status === 'authenticated') getUser();
    }, [status]);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center mt-8">
                    <span className="loading loading-lg"></span>
                </div>
            ) : (
                <>
                    <div>
                        <h1 className="text-2xl font-bold mt-4 mb-8">User Profile</h1>
                        <div className="flex items-center space-x-4">
                            <div className="avatar placeholder mr-4">
                                <div className="bg-neutral text-neutral-content rounded-full w-16">
                                    <span className="text-3xl">{user?.name[0]}</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{user?.name}</h2>
                                <p className="text-gray-600">@{user?.username}</p>
                                <p className="text-gray-600">{user?.tag}</p>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="font-semibold">{user?.followers.length}</p>
                                    <p className="text-gray-600">Followers</p>
                                </div>
                                <div className="mx-4">
                                    <p className="font-semibold">{user?.following.length}</p>
                                    <p className="text-gray-600">Following</p>
                                </div>
                                {session?.user?.id !== user?.id && (
                                    <button className="btn btn-primary">Follow</button>
                                )}
                            </div>
                        </div>
                        <p className="mt-4">{user?.bio || 'Bio'}</p>
                        <p className="text-gray-600 mt-2">Joined: {formatDate(new Date(user?.createdAt || ''))}</p>
                    </div>
                    <div className="mt-8">
                        <div role="tablist" className="tabs tabs-boxed">
                            <a role="tab" 
                                className={`tab ${activeTab === 'created' ? 'tab-active' : ''}`}
                                onClick={() => handleTabChange('created')} 
                            >
                                Created Posts
                            </a>
                            <a role="tab" 
                                className={`tab ${activeTab === 'liked' ? 'tab-active' : ''}`}
                                onClick={() => handleTabChange('liked')} 
                            >
                                Liked Posts
                            </a>
                        </div>
                        <div className="mt-4">
                            <PostList postData={tabContent}/>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
