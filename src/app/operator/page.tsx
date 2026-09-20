'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function OperatorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Single consolidated management panel is /admin
    router.replace('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex items-center gap-2 text-sm text-[#8E98A0]">
        <Sparkles className="w-4 h-4 text-[#D8F224] animate-spin" />
        <span>Redirecting to SHIFT Admin Operations Panel...</span>
      </div>
    </div>
  );
}
