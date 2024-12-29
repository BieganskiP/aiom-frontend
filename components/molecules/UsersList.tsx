"use client";

import { User } from "@/types";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "@/services/users";
import { UserDetailsModal } from "./UserDetailsModal";

interface UsersListProps {
  users: User[];
  onUpdate: () => void;
  onEdit: (user: User) => void;
}

export const UsersList = ({ users, onUpdate, onEdit }: UsersListProps) => {
  const [error, setError] = useState<string>("");
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  return (
    <div className="bg-bg-800 rounded-lg">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
          {error}
        </div>
      )}

      <table className="w-full">
        <thead className="border-b border-bg-700">
          <tr>
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
              Status
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-700">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-4">
                <div className="font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-neutral-400">
                  {user.phoneNumber}
                </div>
              </td>
              <td className="p-4 text-foreground">{user.email}</td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-primary-500/10 text-primary-500"
                      : "bg-neutral-500/10 text-neutral-400"
                  }`}
                >
                  {user.role === "admin" ? "Administrator" : "Kierowca"}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active
                      ? "bg-green-500/10 text-green-500"
                      : "bg-neutral-500/10 text-neutral-400"
                  }`}
                >
                  {user.active ? "Aktywny" : "Nieaktywny"}
                </span>
              </td>
              <td className="p-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setActionUserId(actionUserId === user.id ? null : user.id)
                    }
                    className="p-2 hover:bg-bg-700 rounded-lg"
                  >
                    <MoreVertical size={20} className="text-neutral-400" />
                  </button>

                  {actionUserId === user.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-bg-800 shadow-lg border border-bg-700">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActionUserId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-bg-700 text-foreground rounded-t-lg flex items-center gap-2"
                      >
                        <Eye size={16} />
                        Szczegóły
                      </button>
                      <button
                        onClick={() => {
                          onEdit(user);
                          setActionUserId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-bg-700 text-foreground flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        Edytuj
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(user.id);
                          setActionUserId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-bg-700 text-error-500 rounded-b-lg flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Usuń
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserDetailsModal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
};
