"use client";

import { useState, useEffect } from "react";
import { ProfileForm } from "@/components/molecules/ProfileForm";
import { PasswordForm } from "@/components/molecules/PasswordForm";
import { SettingsForm } from "@/components/molecules/SettingsForm";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { getSettings } from "@/services/settings";
import type { Setting } from "@/types/settings";

type Tab = "profile" | "password" | "company";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER;

  useEffect(() => {
    const fetchSettings = async () => {
      if (!isAdmin) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Nie udało się pobrać ustawień");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isAdmin]);

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Ustawienia</h1>

        <div className="mb-6 border-b border-bg-700">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "profile"
                  ? "text-primary-500 border-b-2 border-primary-500"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profil
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "password"
                  ? "text-primary-500 border-b-2 border-primary-500"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Zmiana hasła
            </button>
            {isAdmin && (
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "company"
                    ? "text-primary-500 border-b-2 border-primary-500"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
                onClick={() => setActiveTab("company")}
              >
                Ustawienia firmowe
              </button>
            )}
          </div>
        </div>

        {activeTab === "profile" ? (
          <ProfileForm />
        ) : activeTab === "password" ? (
          <PasswordForm />
        ) : (
          isAdmin && (
            <>
              {error && (
                <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-neutral-400">Ładowanie ustawień...</div>
              ) : (
                <SettingsForm initialSettings={settings} />
              )}
            </>
          )
        )}
      </div>
    </main>
  );
}
