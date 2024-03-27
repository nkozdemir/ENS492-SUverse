"use client";

import Link from 'next/link';
import { FaHome, FaUser, FaList, FaSignOutAlt, FaSearch, FaRegSun, FaRegMoon } from 'react-icons/fa';
import { IoCreateOutline } from "react-icons/io5";
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 bg-base-300 h-full w-56 flex flex-col justify-between">
      <div className="p-4">
        <h1 className="text-2xl font-bold">SUVerse</h1>
        <ul className="mt-4 space-y-2">
          <li>
            <Link href="/home" className="btn btn-ghost flex">
              <FaHome className="mr-2" size={18}/>
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="btn btn-ghost flex">
              <FaUser className="mr-2" size={18}/>
              Profile
            </Link>
          </li>
          <li>
            <Link href="/search" className="btn btn-ghost flex">
              <FaSearch className="mr-2" size={18}/>
              Search
            </Link>
          </li>
          <li>
            <Link href="/post/create" className="btn btn-ghost flex">
              <IoCreateOutline className="mr-2" size={18} />
              Create Post
            </Link>
          </li>
          <li>
            <Link href="/category/all" className="btn btn-ghost flex">
              <FaList className="mr-2" size={18} />
              Categories
            </Link>
          </li>
        </ul>
      </div>
      <div className='p-4'>
        <button className="btn btn-ghost w-full" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? (
            <FaRegSun size={20} className='mr-2'/>
          ) : (
            <FaRegMoon size={20} className='mr-2'/>
          )}
          Theme
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