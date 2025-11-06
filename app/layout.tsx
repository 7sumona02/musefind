import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MuseFind",
  description: "Developed by Sumona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50`}
      >
        <div className='md:w-sm w-xs mx-auto flex justify-between items-center font-mono pt-10'>
              <Link href='/'><div className="font-bold">(FYM)</div></Link>
             <div className='flex gap-2.5'> 
                <div><Link href='/dashboard'><button className='cursor-pointer text-xs border border-neutral-900 rounded-full px-3 py-1 font-bold'>Add artist</button></Link></div>
                <div><Link href='/favorites'><button className='cursor-pointer text-xs border border-neutral-900 rounded-full px-3 py-1 font-bold'>Favorites</button></Link></div></div>
             </div>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
