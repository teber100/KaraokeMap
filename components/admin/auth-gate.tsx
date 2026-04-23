"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setIsChecking(false);
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isChecking) {
    return <p className="text-sm text-slate-700">Checking admin session...</p>;
  }

  return <>{children}</>;
}
