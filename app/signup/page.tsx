"use client";

import { SignupForm } from "@/components/molecules/forms/SignupForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SignupContent() {
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
    return <div className="text-neutral-400">Weryfikacja zaproszenia...</div>;
  }

  if (!isValidToken || !token) {
    return (
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-primary-500 mb-4">
          Nieprawidłowy link
        </h1>
        <p className="text-neutral-400">
          Link do rejestracji jest nieprawidłowy lub wygasł. Poproś o nowe
          zaproszenie.
        </p>
      </div>
    );
  }

  return (
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
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Suspense fallback={<div className="text-neutral-400">Loading...</div>}>
        <SignupContent />
      </Suspense>
    </main>
  );
}
