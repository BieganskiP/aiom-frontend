"use client";

import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { changePassword } from "@/services/settings";
import { useState } from "react";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordForm = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setError("");
      setSuccess("");
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess("Hasło zostało zmienione");
      reset(); // Clear form after successful password change
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <TextInput
        label="Obecne hasło"
        type="password"
        placeholder="Wprowadź obecne hasło"
        {...register("currentPassword", {
          required: "Obecne hasło jest wymagane",
        })}
        error={errors.currentPassword}
      />

      <TextInput
        label="Nowe hasło"
        type="password"
        placeholder="Wprowadź nowe hasło"
        {...register("newPassword", {
          required: "Nowe hasło jest wymagane",
          minLength: {
            value: 6,
            message: "Hasło musi mieć co najmniej 6 znaków",
          },
        })}
        error={errors.newPassword}
      />

      <TextInput
        label="Potwierdź nowe hasło"
        type="password"
        placeholder="Wprowadź nowe hasło ponownie"
        {...register("confirmPassword", {
          required: "Potwierdzenie hasła jest wymagane",
          validate: (value) =>
            value === newPassword || "Hasła muszą być identyczne",
        })}
        error={errors.confirmPassword}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zmienianie hasła..." : "Zmień hasło"}
        </Button>
      </div>
    </form>
  );
};
