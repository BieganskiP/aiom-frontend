"use client";

import { useState, useRef } from "react";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { updateUserPaidPerStop } from "@/services/users";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface PaidPerStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  currentValue: string;
  userName: string;
}

export function PaidPerStopModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  currentValue,
  userName,
}: PaidPerStopModalProps) {
  const [value, setValue] = useState(currentValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateUserPaidPerStop(userId, parseFloat(value));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update paid per stop:", error);
      setError("Nie udało się zaktualizować stawki");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          Ustaw stawkę dla {userName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Stawka za przystanek
            </label>
            <div className="flex gap-4">
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="max-w-[200px]"
                disabled={loading}
              />
              <span className="text-neutral-400 self-center">zł</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={loading}>
              Zapisz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
