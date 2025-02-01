"use client";

import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/inputs/TextInput";
import { Button } from "@/components/atoms/buttons/Button";
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
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Zmiana hasła</h2>
        <div className="space-y-6">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success-50/10 text-success-500 p-3 rounded-lg text-sm border border-success-500/20">
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

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zmienianie hasła..." : "Zmień hasło"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
