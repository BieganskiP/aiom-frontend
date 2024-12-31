"use client";

import { User } from "@/types";
import { useState } from "react";
import { MoreVertical, Pencil, Ban, Trash2, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser, toggleUserActive } from "@/services/users";
import { UserEditModal } from "./UserEditModal";
import { PaidPerStopModal } from "./PaidPerStopModal";
import { TableWrapper } from "@/components/atoms/TableWrapper";

interface UsersListProps {
  users: User[];
  onUpdate: () => void;
}

export const UsersList = ({ users, onUpdate }: UsersListProps) => {
  const { user: currentUser } = useAuth();
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [paidPerStopUser, setPaidPerStopUser] = useState<{
    id: string;
    name: string;
    currentValue: number;
  } | null>(null);

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      setError("");
      await toggleUserActive(id, active);
      onUpdate();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      setError("");
      await deleteUser(id);
      onUpdate();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  const canManageUser = (user: User) => {
    if (!currentUser) return false;
    if (currentUser.role === "owner" && user.role === "admin") return false;
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "owner") return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <TableWrapper>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-bg-700">
              <th className="text-left p-4 text-neutral-400 font-medium">
                Email
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Imię i nazwisko
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Rola
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Status
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Stawka
              </th>
              <th className="w-10 p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-700">
            {users.map((user) => (
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
                  {user.paidPerStop.toFixed(2)} zł
                </td>
                <td className="p-4">
                  {canManageUser(user) && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionUserId(
                            actionUserId === user.id ? null : user.id
                          );
                        }}
                        className="p-2 hover:bg-bg-700 rounded-lg"
                      >
                        <MoreVertical size={20} className="text-neutral-400" />
                      </button>

                      {actionUserId === user.id && (
                        <div
                          className="fixed md:absolute right-4 md:right-0 mt-2 w-48 bg-bg-800 rounded-lg shadow-lg border border-bg-700 py-1 z-[100]"
                          style={{
                            top: "auto",
                          }}
                        >
                          <button
                            onClick={() => {
                              setActionUserId(null);
                              setEditingUser(user);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Pencil size={16} />
                            Edytuj
                          </button>
                          <button
                            onClick={() => {
                              setActionUserId(null);
                              setPaidPerStopUser({
                                id: user.id,
                                name: `${user.firstName} ${user.lastName}`,
                                currentValue: user.paidPerStop,
                              });
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <DollarSign size={16} />
                            Zmień stawkę
                          </button>
                          <button
                            onClick={() => {
                              setActionUserId(null);
                              handleToggleActive(user.id, !user.active);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Ban size={16} />
                            {user.active ? "Dezaktywuj" : "Aktywuj"}
                          </button>
                          <button
                            onClick={() => {
                              setActionUserId(null);
                              handleDelete(user.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-error-500 hover:bg-error-500/10 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Usuń
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

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
    </div>
  );
};
