"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "@/services/auth";
import { usePathname } from "next/navigation";
import { User } from "@/types";
import { LoadingScreen } from "@/components/atoms/layout/LoadingScreen";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const data = await fetchUserProfile();
      setUser(data);
    } catch (error) {
      // Only clear user on auth errors (401 Unauthorized)
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("unauthorized")
      ) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Cookies.remove("token", { path: "/" });
      }
      // For other errors, keep the current user state and log the error
      console.error("Failed to refresh user profile:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []); // Only run on mount

  useEffect(() => {
    // Fetch user data when pathname changes (but not on initial mount)
    const token = localStorage.getItem("token");
    if (token) {
      refreshUser();
    }
  }, [pathname]);

  useEffect(() => {
    // Set up periodic refresh (every 5 minutes)
    const intervalId = setInterval(refreshUser, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
