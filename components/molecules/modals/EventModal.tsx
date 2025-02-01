"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/buttons/Button";
import { createEvent } from "@/services/events";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EventFormData {
  description: string;
  date: string;
}

export const EventModal = ({ isOpen, onClose, onSuccess }: EventModalProps) => {
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    defaultValues: {
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  const onSubmit = async (data: EventFormData) => {
    try {
      setError("");
      await createEvent({
        description: data.description,
        date: new Date(data.date),
      });
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  if (!isOpen) return null;

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
          Dodaj wydarzenie
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-neutral-200 mb-1 block">
              Data
            </label>
            <input
              type="date"
              {...register("date", {
                required: "Data jest wymagana",
              })}
              className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
            />
            {errors.date && (
              <span className="text-error-500 text-sm mt-1">
                {errors.date.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-200 mb-1 block">
              Opis
            </label>
            <textarea
              {...register("description", {
                required: "Opis jest wymagany",
              })}
              className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground min-h-[100px]"
            />
            {errors.description && (
              <span className="text-error-500 text-sm mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

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
