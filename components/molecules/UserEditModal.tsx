"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { updateUser, createUser } from "@/services/users";
import { User, UserRole } from "@/types";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClickOutside } from "@/hooks/useClickOutside";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User;
}

interface UserEditFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  city: string;
  postCode: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
}

export const UserEditModal = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserEditModalProps) => {
  const { user: currentUser } = useAuth();
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserEditFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || UserRole.USER,
      city: user?.city || "",
      postCode: user?.postCode || "",
      street: user?.street || "",
      houseNumber: user?.houseNumber || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        role: user?.role || UserRole.USER,
        city: user?.city || "",
        postCode: user?.postCode || "",
        street: user?.street || "",
        houseNumber: user?.houseNumber || "",
        phoneNumber: user?.phoneNumber || "",
      });
    }
  }, [isOpen, user, reset]);

  useClickOutside(modalRef, onClose);

  const onSubmit = async (data: UserEditFormData) => {
    try {
      setError("");
      if (user) {
        await updateUser(user.id, data);
      } else {
        await createUser(data);
      }
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

  if (!isOpen) return null;

  const canEditRole =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.OWNER;
  const isOwner = currentUser?.role === UserRole.OWNER;
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-bg-800 rounded-lg p-4 md:p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4">
          {user ? "Edytuj użytkownika" : "Dodaj użytkownika"}
        </h2>

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

          {canEditRole && (
            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 block">
                Rola
              </label>
              <select
                {...register("role")}
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                disabled={!canEditRole}
              >
                <option value={UserRole.USER}>Użytkownik</option>
                <option value={UserRole.LEADER}>Lider</option>
                {isAdmin && <option value={UserRole.OWNER}>Właściciel</option>}
                {isOwner && (
                  <option value={UserRole.ADMIN}>Administrator</option>
                )}
              </select>
            </div>
          )}

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
              pattern: {
                value: /^\d{2}-\d{3}$/,
                message: "Nieprawidłowy kod pocztowy (XX-XXX)",
              },
            })}
            error={errors.postCode}
          />

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
              required: "Numer domu/mieszkania jest wymagany",
            })}
            error={errors.houseNumber}
          />

          <TextInput
            label="Numer telefonu"
            {...register("phoneNumber", {
              required: "Numer telefonu jest wymagany",
              pattern: {
                value: /^\d{9}$/,
                message: "Nieprawidłowy numer telefonu (9 cyfr)",
              },
            })}
            error={errors.phoneNumber}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
