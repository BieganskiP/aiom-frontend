"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { getUsers } from "@/services/users";
import { Button } from "@/components/atoms/Button";
import { UsersList } from "@/components/molecules/UsersList";
import { InviteUserModal } from "@/components/molecules/InviteUserModal";
import { Plus } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError("Nie udało się pobrać listy użytkowników");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-neutral-600">Ładowanie...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-error-500">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Użytkownicy</h1>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Zaproś użytkownika
          </Button>
        </div>

        <UsersList users={users} onUserUpdate={fetchUsers} />

        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onSuccess={fetchUsers}
        />
      </div>
    </main>
  );
}
