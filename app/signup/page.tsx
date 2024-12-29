"use client";

import { SignupForm } from "@/components/molecules/SignupForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }
    // Here you could verify the token with your backend
    setIsValidToken(true);
  }, [token]);

  if (isValidToken === null) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-neutral-400">Weryfikacja zaproszenia...</div>
      </main>
    );
  }

  if (!isValidToken || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-primary-500 mb-4">
            Nieprawidłowy link
          </h1>
          <p className="text-neutral-400">
            Link do rejestracji jest nieprawidłowy lub wygasł. Poproś o nowe
            zaproszenie.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">AIOM</h1>
          <p className="text-neutral-400">All-in-one Manager</p>
        </div>
        <div className="bg-bg-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            Utwórz konto
          </h2>
          <SignupForm token={token} />
        </div>
      </div>
    </main>
  );
}
