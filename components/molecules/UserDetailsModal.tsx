"use client";

import { User } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";

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
  if (!isOpen || !user) return null;

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
          Szczegóły użytkownika
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Dane osobowe
            </h3>
            <p className="text-neutral-900">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">Email</h3>
            <p className="text-neutral-900">{user.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Numer telefonu
            </h3>
            <p className="text-neutral-900">{user.phoneNumber}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">Adres</h3>
            <p className="text-neutral-900">
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
