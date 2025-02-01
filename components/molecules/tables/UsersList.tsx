"use client";

import { User } from "@/types";
import { useState } from "react";
import { Pencil, Ban, Trash2, DollarSign, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser, toggleUserActive } from "@/services/users";
import { UserEditModal } from "@/components/molecules/modals/UserEditModal";
import { PaidPerStopModal } from "@/components/molecules/modals/PaidPerStopModal";
import { DropdownMenu } from "@/components/atoms/inputs/DropdownMenu";
import { UserDetailsModal } from "@/components/molecules/modals/UserDetailsModal";

interface UsersListProps {
  users: User[];
  onUpdate: () => void;
  loading?: boolean;
}

export function UsersList({ users, onUpdate, loading }: UsersListProps) {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [paidPerStopUser, setPaidPerStopUser] = useState<{
    id: string;
    currentValue: string;
    name: string;
  } | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const canManageUser = (targetUser: User) => {
    if (!user) return false;

    // Admin can manage ALL users
    if (user.role === "admin") {
      return true;
    }

    // Owner can manage all users except admins
    if (user.role === "owner") {
      return targetUser.role !== "admin";
    }

    // Leader can only manage regular users
    if (user.role === "leader") {
      return targetUser.role === "user";
    }

    return false;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      setError("");
      await deleteUser(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć użytkownika");
      console.error(error);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      setError("");
      await toggleUserActive(id, !active);
      onUpdate();
    } catch (error) {
      setError("Nie udało się zmienić statusu użytkownika");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <div className="bg-bg-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-700">
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Imię i nazwisko
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Rola
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Stawka
                </th>
                <th className="text-right p-4 text-sm font-medium text-neutral-400">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-neutral-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-neutral-400">
                    Brak użytkowników
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="group">
                    <td className="p-4 text-foreground">{user.email}</td>
                    <td className="p-4 text-foreground">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4 text-foreground capitalize">
                      {user.role === "owner"
                        ? "Właściciel"
                        : user.role === "admin"
                        ? "Administrator"
                        : "Użytkownik"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          user.active
                            ? "bg-green-500/10 text-green-500"
                            : "bg-error-500/10 text-error-500"
                        }`}
                      >
                        {user.active ? "Aktywny" : "Nieaktywny"}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">
                      {user.paidPerStop
                        ? `${parseFloat(user.paidPerStop).toFixed(2)} zł`
                        : "0.00 zł"}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <button
                          onClick={() => setViewingUser(user)}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Pokaż szczegóły
                        </button>
                        {canManageUser(user) && (
                          <>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Pencil size={16} />
                              Edytuj
                            </button>
                            <button
                              onClick={() =>
                                setPaidPerStopUser({
                                  id: user.id,
                                  currentValue: user.paidPerStop || "0.00",
                                  name: `${user.firstName} ${user.lastName}`,
                                })
                              }
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <DollarSign size={16} />
                              Ustaw stawkę
                            </button>
                            <button
                              onClick={() =>
                                handleToggleActive(user.id, user.active)
                              }
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Ban size={16} />
                              {user.active ? "Dezaktywuj" : "Aktywuj"}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="w-full px-4 py-2 text-left text-sm text-error-500 hover:bg-error-500/10 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Usuń
                            </button>
                          </>
                        )}
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <UserEditModal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSuccess={onUpdate}
          user={editingUser}
        />
      )}

      {paidPerStopUser && (
        <PaidPerStopModal
          isOpen={true}
          onClose={() => setPaidPerStopUser(null)}
          onSuccess={onUpdate}
          userId={paidPerStopUser.id}
          currentValue={paidPerStopUser.currentValue}
          userName={paidPerStopUser.name}
        />
      )}

      {viewingUser && (
        <UserDetailsModal
          isOpen={true}
          onClose={() => setViewingUser(null)}
          user={viewingUser}
        />
      )}
    </div>
  );
}
