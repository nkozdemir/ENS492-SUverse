import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SUconnect",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
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
      </body>
    </html>
  );
}
