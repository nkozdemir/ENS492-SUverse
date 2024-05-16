"use client";

import Sidebar from '@/components/layout/sidebar';
import { MdMenu } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';

const Drawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-grow">
        {/* Page content here */}
        <div className="flex justify-start p-2 space-x-2">
            <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden bg-base-200">
                <MdMenu size={24} />
            </label>
            <button 
              className='btn btn-ghost bg-base-200 lg:hidden'
              onClick={() => router.back()}
            >
                <IoIosArrowBack size={24} />
            </button>
        </div>
        <div className='lg:px-4 px-2 my-2'>
            {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="menu p-4 w-56 min-h-full bg-base-200 text-base-content">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Drawer;
