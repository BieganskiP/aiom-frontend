"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { updateUserPaidPerStop } from "@/services/users";
import { X } from "lucide-react";

interface PaidPerStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  currentValue: number;
  userName: string;
}

interface PaidPerStopFormData {
  paidPerStop: string;
}

export const PaidPerStopModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  currentValue,
  userName,
}: PaidPerStopModalProps) => {
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaidPerStopFormData>({
    defaultValues: {
      paidPerStop: currentValue.toString(),
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: PaidPerStopFormData) => {
    try {
      setError("");
      await updateUserPaidPerStop(userId, parseFloat(data.paidPerStop));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-neutral-800 mb-4">
          Edytuj stawkę za przystanek
        </h2>
        <p className="text-sm text-neutral-600 mb-4">Użytkownik: {userName}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <TextInput
            type="number"
            step="0.01"
            label="Stawka za przystanek"
            {...register("paidPerStop", {
              required: "Stawka jest wymagana",
              min: {
                value: 0,
                message: "Stawka nie może by�� ujemna",
              },
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Nieprawidłowy format (max. 2 miejsca po przecinku)",
              },
            })}
            error={errors.paidPerStop}
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
