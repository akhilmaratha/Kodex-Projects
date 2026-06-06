'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();



  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-white text-xl">Loading Chatty...</div>
    </div>
  );
}
