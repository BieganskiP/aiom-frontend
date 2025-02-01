"use client";

import { Route, User } from "@/types";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteRoute, unassignRoute } from "@/services/routes";
import { TableWrapper } from "@/components/atoms/layout/TableWrapper";
import { getUsers } from "@/services/users";
import { AssignRouteModal } from "@/components/molecules/modals/AssignRouteModal";
import { DropdownMenu } from "@/components/atoms/inputs/DropdownMenu";

interface RoutesListProps {
  routes: Route[];
  onUpdate: () => void;
  onEdit: (route: Route) => void;
}

export const RoutesList = ({ routes, onUpdate, onEdit }: RoutesListProps) => {
  const { user } = useAuth();
  const canManageRoutes = user?.role === "admin" || user?.role === "owner";
  const canAssignUsers = canManageRoutes || user?.role === "leader";
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [assigningRoute, setAssigningRoute] = useState<{
    routeId: string;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę trasę?")) return;

    try {
      setError("");
      await deleteRoute(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć trasy");
      console.error(error);
    }
  };

  const handleUnassign = async (routeId: string) => {
    if (!window.confirm("Czy na pewno chcesz odpiąć użytkownika od trasy?"))
      return;

    try {
      setError("");
      await unassignRoute(routeId);
      onUpdate();
    } catch (error) {
      setError("Nie udało się odpiąć użytkownika od trasy");
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
                Nazwa
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Opis
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Przypisany użytkownik
              </th>
              <th className="w-10 p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-700">
            {routes.map((route) => (
              <tr key={route.id} className="group">
                <td className="p-4 text-foreground">{route.name}</td>
                <td className="p-4 text-foreground">
                  {route.description || "-"}
                </td>
                <td className="p-4 text-foreground">
                  {route.assignedUser
                    ? `${route.assignedUser.firstName} ${route.assignedUser.lastName}`
                    : "-"}
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    {canManageRoutes && (
                      <>
                        <button
                          onClick={() => onEdit(route)}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Edytuj
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="w-full px-4 py-2 text-left text-sm text-error-500 hover:bg-error-500/10 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Usuń
                        </button>
                      </>
                    )}
                    {canAssignUsers && (
                      <>
                        {route.assignedUser ? (
                          <button
                            onClick={() => handleUnassign(route.id)}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Users size={16} />
                            Odepnij użytkownika
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setAssigningRoute({ routeId: route.id })
                            }
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Users size={16} />
                            Przypisz użytkownika
                          </button>
                        )}
                      </>
                    )}
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {assigningRoute && (
        <AssignRouteModal
          isOpen={true}
          onClose={() => setAssigningRoute(null)}
          onSuccess={onUpdate}
          routeId={assigningRoute.routeId}
          users={users}
        />
      )}
    </div>
  );
};
