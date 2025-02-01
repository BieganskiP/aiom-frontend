"use client";

import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/inputs/TextInput";
import { Button } from "@/components/atoms/buttons/Button";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const response = await login(data.email, data.password);

      // Store token in both cookie and localStorage
      Cookies.set("token", response.access_token, {
        expires: 365 * 100, // 100 years to match backend
        path: "/",
        sameSite: "strict",
      });
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.user.active) {
        router.push("/dashboard");
      } else {
        router.push("/inactive");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <TextInput
          label="Email"
          type="email"
          placeholder="Wprowadź adres email"
          {...register("email", {
            required: "Email jest wymagany",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Nieprawidłowy adres email",
            },
          })}
          error={errors.email}
        />

        <TextInput
          label="Hasło"
          type="password"
          placeholder="Wprowadź hasło"
          {...register("password", {
            required: "Hasło jest wymagane",
            minLength: {
              value: 6,
              message: "Hasło musi mieć co najmniej 6 znaków",
            },
          })}
          error={errors.password}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-500 hover:bg-primary-600 text-white w-full py-2.5"
      >
        {isSubmitting ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
};
