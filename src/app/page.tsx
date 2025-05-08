// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/nx-admin/login');
  }, [router]);

  return <div className="h-screen flex items-center justify-center">Redirecting...</div>;
}
