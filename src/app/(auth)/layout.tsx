import "../../styles/globals.css";
import Navbar from "@/components/layout/navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        {children}
      </div>
    </>
  );
}
