"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/molecules/ProfileForm";
import { PasswordForm } from "@/components/molecules/PasswordForm";

type Tab = "profile" | "password";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">Ustawienia</h1>

        <div className="mb-6 border-b border-neutral-200">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "profile"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profil
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "password"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Zmiana hasła
            </button>
          </div>
        </div>

        {activeTab === "profile" ? <ProfileForm /> : <PasswordForm />}
      </div>
    </main>
  );
}
