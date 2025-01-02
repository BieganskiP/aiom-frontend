"use client";

import { useRef } from "react";
import { User } from "@/types";
import { X, Phone, Mail, MapPin } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuth } from "@/contexts/AuthContext";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) => {
  const { user: currentUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const canViewSensitiveInfo =
    currentUser?.role === "admin" || currentUser?.role === "owner";

  useClickOutside(modalRef, onClose);

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

        <h2 className="text-xl font-bold text-foreground mb-6">
          Szczegóły użytkownika
        </h2>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Podstawowe informacje
            </h3>
            <div className="space-y-2">
              <p className="text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-400"
              >
                <Mail size={16} />
                {user.email}
              </a>
              <a
                href={`tel:${user.phoneNumber}`}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-400"
              >
                <Phone size={16} />
                {user.phoneNumber}
              </a>
            </div>
          </div>

          {/* Role & Status */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Rola i status
            </h3>
            <div className="space-y-2">
              <p className="text-foreground capitalize">
                Rola:{" "}
                <span className="text-primary-500">
                  {user.role === "owner"
                    ? "Właściciel"
                    : user.role === "admin"
                    ? "Administrator"
                    : user.role === "leader"
                    ? "Lider"
                    : "Użytkownik"}
                </span>
              </p>
              <p className="text-foreground">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    user.active
                      ? "bg-green-500/10 text-green-500"
                      : "bg-error-500/10 text-error-500"
                  }`}
                >
                  {user.active ? "Aktywny" : "Nieaktywny"}
                </span>
              </p>
            </div>
          </div>

          {/* Address - only for admin/owner */}
          {canViewSensitiveInfo && (
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">
                Adres
              </h3>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-neutral-400 mt-1" />
                <div>
                  <p className="text-foreground">
                    {user.street} {user.houseNumber}
                  </p>
                  <p className="text-foreground">
                    {user.postCode} {user.city}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Work Info */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Informacje o pracy
            </h3>
            <div className="space-y-2">
              <p className="text-foreground">
                Stawka za przystanek:{" "}
                <span className="text-primary-500">
                  {user.paidPerStop
                    ? `${parseFloat(user.paidPerStop).toFixed(2)} zł`
                    : "0.00 zł"}
                </span>
              </p>
              {user.car && (
                <p className="text-foreground">
                  Przypisany samochód:{" "}
                  <span className="text-primary-500">{user.car.name}</span>
                </p>
              )}
              {user.route && (
                <p className="text-foreground">
                  Przypisana trasa:{" "}
                  <span className="text-primary-500">{user.route.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* System Info - only for admin/owner */}
          {canViewSensitiveInfo && (
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">
                Informacje systemowe
              </h3>
              <div className="space-y-2 text-sm text-neutral-400">
                <p>ID: {user.id}</p>
                <p>
                  Utworzono:{" "}
                  {new Date(user.createdAt).toLocaleDateString("pl-PL")}
                </p>
                <p>
                  Ostatnia aktualizacja:{" "}
                  {new Date(user.updatedAt).toLocaleDateString("pl-PL")}
                </p>
                {user.lastLogin && (
                  <p>
                    Ostatnie logowanie:{" "}
                    {new Date(user.lastLogin).toLocaleDateString("pl-PL")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
