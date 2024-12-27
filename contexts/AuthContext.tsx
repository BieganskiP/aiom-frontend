"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "@/services/auth";
import { usePathname } from "next/navigation";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const data = await fetchUserProfile();
      setUser(data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    // Fetch user data when component mounts and when pathname changes
    const token = localStorage.getItem("token");
    if (token) {
      refreshUser();
    }
  }, [pathname]); // Re-fetch when route changes

  useEffect(() => {
    // Set up periodic refresh (every 5 minutes)
    const intervalId = setInterval(refreshUser, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshUser }}>
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
