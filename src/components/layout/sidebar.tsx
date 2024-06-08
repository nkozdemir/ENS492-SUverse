"use client";

import Link from 'next/link';
import { FaHome, FaList, FaSignOutAlt, FaSearch, FaRegBell, FaUser } from 'react-icons/fa';
import { SlUserFollowing } from "react-icons/sl";
import { IoCreateOutline } from "react-icons/io5";
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import UserProfilePicture from '../userProfilePicture';
import { useEffect, useState } from 'react';

const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchUnreadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/get/getUnreadNotifications');
      const data = await res.json();
      console.log('Fetch unread notifications response:', data);
      if (data.status === 200 && data.data.length > 0)
        setUnreadNotifications(data.data.length);
      else
        setUnreadNotifications(0);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated')
      fetchUnreadNotifications();
  }, [status]);

  return (
    <div className="fixed top-0 left-0 bg-base-300 h-full w-56 flex flex-col justify-between">
      <div className="p-4">
        <Link href="/home">
          <h1 className="text-2xl font-bold text-primary">SUVerse</h1>
        </Link>
        <ul className="mt-4 space-y-2">
          <li onClick={fetchUnreadNotifications}>
            <Link href="/home" className="btn btn-ghost flex">
              <FaHome className="mr-2" size={18}/>
              Home
            </Link>
          </li>
          <li onClick={fetchUnreadNotifications}>
            <Link href="/post/following" className="btn btn-ghost flex">
              <SlUserFollowing className="mr-2" size={18}/>
              Following
            </Link>
          </li>
          <li onClick={fetchUnreadNotifications}>
            <Link href={`/user/${session?.user.id}`} className="btn btn-ghost flex">
              <FaUser className="mr-2" size={18}/>
              Profile
            </Link>
          </li>
          <li onClick={fetchUnreadNotifications}>
            <Link href="/search" className="btn btn-ghost flex">
              <FaSearch className="mr-2" size={18}/>
              Search
            </Link>
          </li>
          <li onClick={fetchUnreadNotifications}>
            <Link href="/post/create" className="btn btn-ghost flex">
              <IoCreateOutline className="mr-2" size={18} />
              Create Post
            </Link>
          </li>
          <li onClick={fetchUnreadNotifications}>
            <Link href="/category/all" className="btn btn-ghost flex">
              <FaList className="mr-2" size={18} />
              Categories
            </Link>
          </li>
          <li onClick={fetchUnreadNotifications}>
            <Link href="/notifications" className="btn btn-ghost flex">
              <FaRegBell className="" size={18} />
              Notifications
              {unreadNotifications > 0 && <span className="badge badge-info">{unreadNotifications}</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div className='p-4'>
        {session && session.user && (
          <Link href={`/user/${session?.user.id}`}> 
            <div onClick={fetchUnreadNotifications} className="flex items-center justify-center border border-primary rounded-lg p-2 mb-8 bg-base-100 shadow-lg">
              <div>
                <UserProfilePicture imageUrl={session.user.profilePic} size={60} />
              </div>
              <div className="ml-4">
                <span className="text-lg font-semibold">{session.user.name}</span>
                <br />
                <span className='text-gray-500 text-sm'>@{session.user.username}</span>
              </div>
            </div>
          </Link>
        )}
        <button className="btn btn-ghost btn-outline w-full mb-2" onClick={() => setTheme(theme === 'winter' ? 'night' : 'winter')}>
          Toggle Theme
        </button>
        <button className="btn btn-error w-full" onClick={() => signOut()}>
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;