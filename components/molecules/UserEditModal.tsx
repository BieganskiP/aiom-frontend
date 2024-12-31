"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { updateUser } from "@/services/users";
import { User } from "@/types";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User;
}

interface UserEditFormData {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  postCode: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
  role: string;
  active: boolean;
  paidPerStop: number;
}

export const UserEditModal = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserEditModalProps) => {
  const { user: currentUser } = useAuth();
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserEditFormData>({
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      postCode: user.postCode || "",
      street: user.street,
      houseNumber: user.houseNumber,
      phoneNumber: user.phoneNumber,
      role: user.role,
      active: user.active,
      paidPerStop: user.paidPerStop,
    },
  });

  const currentRole = watch("role");

  useEffect(() => {
    if (isOpen) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        postCode: user.postCode || "",
        street: user.street,
        houseNumber: user.houseNumber,
        phoneNumber: user.phoneNumber,
        role: user.role,
        active: user.active,
        paidPerStop: user.paidPerStop,
      });
    }
  }, [isOpen, user, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: UserEditFormData) => {
    try {
      setError("");
      await updateUser(user.id, data);
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-800 rounded-lg p-4 md:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4">
          Edytuj użytkownika
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <TextInput label="Email" {...register("email")} disabled />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Miasto"
              {...register("city", {
                required: "Miasto jest wymagane",
              })}
              error={errors.city}
            />

            <TextInput
              label="Kod pocztowy"
              {...register("postCode", {
                required: "Kod pocztowy jest wymagany",
              })}
              error={errors.postCode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Ulica"
              {...register("street", {
                required: "Ulica jest wymagana",
              })}
              error={errors.street}
            />

            <TextInput
              label="Numer domu"
              {...register("houseNumber", {
                required: "Numer domu jest wymagany",
              })}
              error={errors.houseNumber}
            />
          </div>

          <TextInput
            label="Numer telefonu"
            {...register("phoneNumber", {
              required: "Numer telefonu jest wymagany",
            })}
            error={errors.phoneNumber}
          />

          {currentUser?.role === "admin" || currentUser?.role === "owner" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-200 mb-1 block">
                    Rola
                  </label>
                  <select
                    className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                    {...register("role")}
                    disabled={
                      (currentUser.role === "owner" && user.role === "admin") ||
                      (currentUser.role === "admin" && user.role === "owner") ||
                      (currentUser.role === "admin" && currentRole === "owner")
                    }
                  >
                    <option value="user">Użytkownik</option>
                    <option value="admin">Administrator</option>
                    {(currentUser.role === "admin" ||
                      currentUser.role === "owner") && (
                      <option value="owner">Właściciel</option>
                    )}
                  </select>
                </div>

                <TextInput
                  type="number"
                  step="0.01"
                  label="Stawka za przystanek"
                  {...register("paidPerStop", {
                    required: "Stawka jest wymagana",
                    min: {
                      value: 0,
                      message: "Stawka nie może być ujemna",
                    },
                  })}
                  error={errors.paidPerStop}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  className="rounded border-bg-700 bg-bg-700 text-primary-500 focus:ring-primary-500"
                  {...register("active")}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium text-neutral-200"
                >
                  Aktywny
                </label>
              </div>
            </>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
