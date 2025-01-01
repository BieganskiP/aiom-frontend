"use client";

import { useRef } from "react";
import { User } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useClickOutside } from "@/hooks/useClickOutside";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  if (!isOpen || !user) return null;

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
          Szczegóły użytkownika
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-1">
              Dane osobowe
            </h3>
            <p className="text-foreground">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Email</h3>
            <p className="text-foreground">{user.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-1">
              Numer telefonu
            </h3>
            <p className="text-foreground">{user.phoneNumber}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Adres</h3>
            <p className="text-foreground">
              {user.street} {user.houseNumber}
              <br />
              {user.postCode} {user.city}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline" onClick={onClose} className="w-full">
            Zamknij
          </Button>
        </div>
      </div>
    </div>
  );
};
