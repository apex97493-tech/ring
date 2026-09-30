'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackOrderRedirect() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qs = params.toString();
    router.replace('/my-orders' + (qs ? '?' + qs : ''));
  }, [router]);
  return (
    <div className="min-h-screen bg-[#FAFDF8] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="w-10 h-10 border-2 border-[#B76E79]/30 border-t-[#B76E79] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Redirecting to My Orders…</p>
      </div>
    </div>
  );
}
