"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { getUsers } from "@/services/users";
import { Button } from "@/components/atoms/Button";
import { UsersList } from "@/components/molecules/UsersList";
import { InviteUserModal } from "@/components/molecules/InviteUserModal";
import { Plus } from "lucide-react";
import PageHeader from "@/components/atoms/PageHeader";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Użytkownicy" />
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Zaproś użytkownika</span>
          <span className="sm:hidden">Zaproś</span>
        </Button>
      </div>

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-6">
          {error}
        </div>
      )}

      <UsersList users={users} onUpdate={fetchUsers} loading={loading} />

      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
