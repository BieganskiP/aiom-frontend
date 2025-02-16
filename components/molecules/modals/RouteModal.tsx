"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/inputs/TextInput";
import { Button } from "@/components/atoms/buttons/Button";
import { createRoute, updateRoute } from "@/services/routes";
import { Route } from "@/types";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  route?: Route | null;
}

interface RouteFormData {
  name: string;
  description: string;
}

export const RouteModal = ({
  isOpen,
  onClose,
  onSuccess,
  route,
}: RouteModalProps) => {
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormData>();

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  useEffect(() => {
    if (route) {
      reset({
        name: route.name,
        description: route.description,
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [route, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: RouteFormData) => {
    try {
      setError("");
      if (route) {
        await updateRoute(route.id, data);
      } else {
        await createRoute(data);
      }
      reset();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-bg-800 rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4">
          {route ? "Edytuj trasę" : "Dodaj trasę"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <TextInput
            label="Nazwa"
            placeholder="Wprowadź nazwę trasy"
            {...register("name", {
              required: "Nazwa jest wymagana",
            })}
            error={errors.name}
          />

          <TextInput
            label="Opis"
            placeholder="Wprowadź opis trasy"
            {...register("description", {
              required: "Opis jest wymagany",
            })}
            error={errors.description}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Zapisywanie..."
                : route
                ? "Zapisz zmiany"
                : "Dodaj trasę"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
