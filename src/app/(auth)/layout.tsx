import "../../styles/globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          custom: {
            duration: 3000,
          },
        }}
        containerStyle={{
          marginTop: '12px',
        }}
      />
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        {children}
      </div>
    </>
  );
}
