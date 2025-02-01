"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/inputs/TextInput";
import { Button } from "@/components/atoms/buttons/Button";
import { signup } from "@/services/auth";
import { useRouter } from "next/navigation";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  street: string;
  houseNumber: string;
  postCode: string;
  city: string;
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
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignupFormData>();

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      await signup({ ...data, token });
      router.push("/");
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
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Imię"
          {...register("firstName", {
            required: "Imię jest wymagane",
          })}
          error={errors.firstName}
        />

        <TextInput
          label="Nazwisko"
          {...register("lastName", {
            required: "Nazwisko jest wymagane",
          })}
          error={errors.lastName}
        />
      </div>

      <TextInput
        type="email"
        label="Email"
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
        type="password"
        label="Hasło"
        {...register("password", {
          required: "Hasło jest wymagane",
          minLength: {
            value: 8,
            message: "Hasło musi mieć co najmniej 8 znaków",
          },
        })}
        error={errors.password}
      />

      <TextInput
        type="password"
        label="Potwierdź hasło"
        {...register("confirmPassword", {
          required: "Potwierdzenie hasła jest wymagane",
          validate: (value) =>
            value === password || "Hasła muszą być identyczne",
        })}
        error={errors.confirmPassword}
      />

      <TextInput
        type="tel"
        label="Numer telefonu"
        {...register("phoneNumber", {
          required: "Numer telefonu jest wymagany",
          pattern: {
            value: /^[0-9]{9}$/,
            message: "Nieprawidłowy numer telefonu",
          },
        })}
        error={errors.phoneNumber}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Ulica"
          {...register("street", {
            required: "Ulica jest wymagana",
          })}
          error={errors.street}
        />

        <TextInput
          label="Numer domu/mieszkania"
          {...register("houseNumber", {
            required: "Numer domu jest wymagany",
          })}
          error={errors.houseNumber}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Kod pocztowy"
          {...register("postCode", {
            required: "Kod pocztowy jest wymagany",
            pattern: {
              value: /^[0-9]{2}-[0-9]{3}$/,
              message: "Nieprawidłowy kod pocztowy",
            },
          })}
          error={errors.postCode}
        />

        <TextInput
          label="Miejscowość"
          {...register("city", {
            required: "Miejscowość jest wymagana",
          })}
          error={errors.city}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Rejestracja..." : "Zarejestruj się"}
      </Button>
    </form>
  );
};
