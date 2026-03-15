"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase/client";
import type { User } from "@/lib/supabase/types";

interface VisitorContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const VisitorContext = createContext<VisitorContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const { isLoaded } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const supabase = createAuthClient(token);
      const { data } = await supabase.from("users").select("*").single();
      setUser(data as User | null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  return (
    <VisitorContext.Provider value={{ user, loading, refresh: fetchUser }}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  return useContext(VisitorContext);
}
