"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/buttons/Button";
import { assignRoute } from "@/services/routes";
import { User } from "@/types";
import { useClickOutside } from "@/hooks/useClickOutside";

interface AssignRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  routeId: string;
  users: User[];
}

export const AssignRouteModal = ({
  isOpen,
  onClose,
  onSuccess,
  routeId,
  users,
}: AssignRouteModalProps) => {
  const [error, setError] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setIsSubmitting(true);
      await assignRoute(routeId, selectedUserId);
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    } finally {
      setIsSubmitting(false);
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
          Przypisz trasę do użytkownika
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-neutral-200">
              Użytkownik
            </label>
            <select
              className="mt-1 w-full rounded-lg border bg-bg-700 border-bg-700 px-3 py-2 text-sm text-foreground"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">Wybierz użytkownika</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Przypisz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
