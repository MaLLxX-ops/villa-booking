"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Check if authorization code landed on client
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("code=")
    ) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        supabase.auth
          .exchangeCodeForSession(code)
          .then(({ data }) => {
            if (data.user) {
              setUser(data.user);
              setIsLoading(false);
              router.push("/account");
            }
          })
          .catch((err) => {
            console.error("Client code exchange error:", err);
          });
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        router.refresh();
      }
    );
    return () => subscription.subscription.unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) throw error;
  };

  const signInWithPassword = async (email: string, password: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    router.refresh();
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || undefined,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    setUser(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("SignOut error:", err);
    }
    if (
      typeof window !== "undefined" &&
      window.location.pathname.includes("/account")
    ) {
      router.push("/");
    } else {
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithPassword,
        signUp,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}