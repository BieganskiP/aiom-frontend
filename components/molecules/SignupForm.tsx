"use client";

import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { signup } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignupFormData {
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  city: string;
  postCode: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
}

interface SignupFormProps {
  token: string;
}

export const SignupForm = ({ token }: SignupFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const password = watch("password");

  const onSubmit = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirmPassword,
    ...signupData
  }: SignupFormData) => {
    try {
      setError("");
      await signup({
        ...signupData,
        token,
      });
      router.push("/?registered=true");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd podczas rejestracji");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {error && (
        <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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

      <TextInput
        label="Potwierdź hasło"
        type="password"
        placeholder="Wprowadź hasło ponownie"
        {...register("confirmPassword", {
          required: "Potwierdzenie hasła jest wymagane",
          validate: (value) =>
            value === password || "Hasła muszą być identyczne",
        })}
        error={errors.confirmPassword}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Tworzenie konta..." : "Utwórz konto"}
      </Button>
    </form>
  );
};
