"use client";

import { User } from "@/types";
import { useState } from "react";
import { Pencil, Ban, Trash2, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser, toggleUserActive } from "@/services/users";
import { UserEditModal } from "./UserEditModal";
import { PaidPerStopModal } from "./PaidPerStopModal";
import { TableWrapper } from "@/components/atoms/TableWrapper";
import { DropdownMenu } from "@/components/atoms/DropdownMenu";

interface UsersListProps {
  users: User[];
  onUpdate: () => void;
}

export const UsersList = ({ users, onUpdate }: UsersListProps) => {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [paidPerStopUser, setPaidPerStopUser] = useState<{
    id: string;
    currentValue: number;
    name: string;
  } | null>(null);

  const canManageUser = (targetUser: User) => {
    if (!user) return false;
    if (user.role === "owner") return true;
    if (user.role === "admin" && targetUser.role !== "owner") return true;
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
                  {typeof user.paidPerStop === "number"
                    ? `${user.paidPerStop.toFixed(2)} zł`
                    : "0.00 zł"}
                </td>
                <td className="p-4">
                  {canManageUser(user) && (
                    <DropdownMenu>
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
                            currentValue: user.paidPerStop || 0,
                            name: `${user.firstName} ${user.lastName}`,
                          })
                        }
                        className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                      >
                        <DollarSign size={16} />
                        Ustaw stawkę
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id, user.active)}
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
                    </DropdownMenu>
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
