"use client";

import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { updateProfile } from "@/services/settings";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  city: string;
  postCode: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
}

export const ProfileForm = () => {
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      city: user?.city || "",
      postCode: user?.postCode || "",
      street: user?.street || "",
      houseNumber: user?.houseNumber || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError("");
      setSuccess("");
      await updateProfile(data);
      await refreshUser();
      setSuccess("Profil został zaktualizowany");
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
        <h2 className="text-lg font-semibold mb-4">Dane osobowe</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Imię"
              type="text"
              placeholder="Wprowadź imię"
              {...register("firstName", {
                required: "Imię jest wymagane",
              })}
              error={errors.firstName}
            />

            <TextInput
              label="Nazwisko"
              type="text"
              placeholder="Wprowadź nazwisko"
              {...register("lastName", {
                required: "Nazwisko jest wymagane",
              })}
              error={errors.lastName}
            />
          </div>

          <TextInput
            label="Numer telefonu"
            type="tel"
            placeholder="Wprowadź numer telefonu"
            {...register("phoneNumber", {
              required: "Numer telefonu jest wymagany",
              pattern: {
                value: /^[0-9]{9}$/,
                message: "Nieprawidłowy numer telefonu (9 cyfr)",
              },
            })}
            error={errors.phoneNumber}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Miasto"
              type="text"
              placeholder="Wprowadź miasto"
              {...register("city", {
                required: "Miasto jest wymagane",
              })}
              error={errors.city}
            />

            <TextInput
              label="Kod pocztowy"
              type="text"
              placeholder="Wprowadź kod pocztowy"
              {...register("postCode", {
                required: "Kod pocztowy jest wymagany",
                pattern: {
                  value: /^[0-9]{2}-[0-9]{3}$/,
                  message: "Nieprawidłowy kod pocztowy (format: XX-XXX)",
                },
              })}
              error={errors.postCode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Ulica"
              type="text"
              placeholder="Wprowadź ulicę"
              {...register("street", {
                required: "Ulica jest wymagana",
              })}
              error={errors.street}
            />

            <TextInput
              label="Numer domu/mieszkania"
              type="text"
              placeholder="Wprowadź numer domu/mieszkania"
              {...register("houseNumber", {
                required: "Numer domu/mieszkania jest wymagany",
              })}
              error={errors.houseNumber}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
