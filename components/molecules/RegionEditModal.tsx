"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import {
  updateRegion,
  createRegion,
  assignLeaderToRegion,
  removeLeaderFromRegion,
} from "@/services/regions";
import { Region, User } from "@/types";
import { X, Users } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getUsers } from "@/services/users";

interface RegionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  region?: Region;
}

interface RegionEditFormData {
  name: string;
  description: string;
}

export const RegionEditModal = ({
  isOpen,
  onClose,
  onSuccess,
  region,
}: RegionEditModalProps) => {
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>(
    region?.leaderId || ""
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegionEditFormData>({
    defaultValues: {
      name: region?.name || "",
      description: region?.description || "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // Filter to only show users with leader role or no role
        setUsers(
          data.filter((user) => user.role === "leader" || user.role === "user")
        );
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (isOpen) {
      fetchUsers();
      reset({
        name: region?.name || "",
        description: region?.description || "",
      });
      setSelectedLeaderId(region?.leaderId || "");
    }
  }, [isOpen, region, reset]);

  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  const handleLeaderChange = async (leaderId: string) => {
    if (!region) return;

    try {
      setError("");
      if (leaderId) {
        await assignLeaderToRegion(region.id, leaderId);
      } else if (region.leaderId) {
        await removeLeaderFromRegion(region.id);
      }
      setSelectedLeaderId(leaderId);
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił błąd podczas zmiany lidera");
      }
    }
  };

  const onSubmit = async (data: RegionEditFormData) => {
    try {
      setError("");
      if (region) {
        await updateRegion(region.id, data);
      } else {
        await createRegion(data);
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
          {region ? "Edytuj region" : "Dodaj region"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <TextInput
            label="Nazwa"
            {...register("name", {
              required: "Nazwa jest wymagana",
            })}
            error={errors.name}
          />

          <TextInput
            label="Opis"
            {...register("description")}
            error={errors.description}
          />

          {region && (
            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 flex items-center gap-2">
                <Users size={16} />
                Lider
              </label>
              <select
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                value={selectedLeaderId}
                onChange={(e) => handleLeaderChange(e.target.value)}
              >
                <option value="">Brak lidera</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                    {user.role === "leader" ? " (Lider)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

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
