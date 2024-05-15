import Drawer from '@/components/layout/drawer';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Drawer>
      {children}
    </Drawer>
  );
};

export default ProtectedLayout;
