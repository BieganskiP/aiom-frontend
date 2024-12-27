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
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-neutral-600">Weryfikacja zaproszenia...</div>
      </main>
    );
  }

  if (!isValidToken) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Nieprawidłowy link
          </h1>
          <p className="text-neutral-600">
            Link do rejestracji jest nieprawidłowy lub wygasł. Poproś o nowe
            zaproszenie.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
          Utwórz konto
        </h1>
        <SignupForm token={token} />
      </div>
    </main>
  );
}
