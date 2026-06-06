'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Chats() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700">
        <h1 className="text-2xl font-bold">Chatty</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome, {user?.name}</span>
          <button
            onClick={logoutHandler}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400">
        <p>Chat interface will be implemented in Phase 2!</p>
      </div>
    </div>
  );
}
