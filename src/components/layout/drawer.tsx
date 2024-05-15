import Sidebar from '@/components/layout/sidebar';
import { MdMenu } from "react-icons/md";

const Drawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-grow">
        {/* Page content here */}
        <div className="flex justify-start p-2">
            <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden">
                <MdMenu size={24} />
            </label>
        </div>
        <div className='px-4 mt-4'>
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
