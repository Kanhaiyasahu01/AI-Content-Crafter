'use client'

import { useRouter } from 'next/navigation';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect to dashboard if user is signed in
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col justify-between items-center text-white">
      
      {/* Main Content */}
      <div className="text-center my-5 max-w-3xl ">
        <h1 className="text-5xl font-extrabold leading-tight mb-4">Welcome to AI Content Crafter</h1>
        <p className="text-xl font-medium">Unlock the power of AI to craft high-quality, personalized content in seconds. Revolutionize your workflow with the future of writing.</p>
      </div>

      {/* Centered Sign In Button */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <SignedOut>
          <div className="bg-primary-600 hover:bg-primary-700 py-3 px-8 text-white font-bold rounded-lg cursor-pointer shadow-md">
            <SignInButton />
            <span> to continue</span>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="bg-primary-600 hover:bg-primary-700 py-3 px-8 text-white font-bold rounded-lg cursor-pointer shadow-md">
            <UserButton />
          </div>
        </SignedIn>
      </div>

      {/* Card Layout for Features */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
          <h3 className="text-2xl font-semibold mb-3 text-primary">Easy to Use</h3>
          <p className="text-gray-700">Our intuitive interface allows you to start creating high-quality content in minutes. No steep learning curve – just results.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
          <h3 className="text-2xl font-semibold mb-3 text-primary">AI-Powered Excellence</h3>
          <p className="text-gray-700">Leveraging the latest in AI technology, we help you create content that's engaging, relevant, and on-brand every time.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
          <h3 className="text-2xl font-semibold mb-3 text-primary">Collaborative Tools</h3>
          <p className="text-gray-700">Work with your team, share content, and collaborate seamlessly to bring your ideas to life faster than ever.</p>
        </div>
      </div>

      {/* Footer with Black Background */}
      <footer className="bg-black text-center text-gray-100 py-6 mt-16 w-full">
        <p>&copy; 2024 AI Content Crafter. All rights reserved.</p>
      </footer>
    </div>
  );
}
