"use client";

import { Route } from "@/types";
import { deleteRoute, softDeleteRoute, unassignRoute } from "@/services/routes";
import { MoreVertical, Pencil, Trash2, Ban, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TableWrapper } from "@/components/atoms/TableWrapper";
import { getUsers } from "@/services/users";
import { AssignRouteModal } from "./AssignRouteModal";

interface RoutesListProps {
  routes: Route[];
  onUpdate: () => void;
  onEdit: (route: Route) => void;
}

export const RoutesList = ({ routes, onUpdate, onEdit }: RoutesListProps) => {
  const { user } = useAuth();
  const [actionRouteId, setActionRouteId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [assigningRoute, setAssigningRoute] = useState<{
    routeId: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
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

  const handleSoftDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz dezaktywować tę trasę?")) return;

    try {
      setError("");
      await softDeleteRoute(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się dezaktywować trasy");
      console.error(error);
    }
  };

  const handleUnassign = async (routeId: string) => {
    if (!window.confirm("Czy na pewno chcesz odpiąć trasę od użytkownika?"))
      return;

    try {
      setError("");
      await unassignRoute(routeId);
      onUpdate();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
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
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[200px]">
                Nazwa
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[200px]">
                Przypisany kierowca
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400 w-[120px]">
                Status
              </th>
              <th className="w-[80px] p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-700">
            {routes.map((route) => (
              <tr key={route.id} className="group">
                <td className="p-4">
                  <div className="font-medium text-foreground truncate">
                    {route.name}
                  </div>
                  <div className="text-sm text-neutral-400 truncate">
                    {route.description}
                  </div>
                </td>

                <td className="p-4 text-neutral-200 truncate">
                  {route.assignedUser
                    ? `${route.assignedUser.firstName} ${route.assignedUser.lastName}`
                    : "Brak"}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      route.active
                        ? "bg-green-500/10 text-green-500"
                        : "bg-neutral-500/10 text-neutral-400"
                    }`}
                  >
                    {route.active ? "Aktywna" : "Nieaktywna"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionRouteId(
                          actionRouteId === route.id ? null : route.id
                        );
                      }}
                      className="p-2 hover:bg-bg-700 rounded-lg"
                      disabled={user?.role !== "admin"}
                    >
                      <MoreVertical size={20} className="text-neutral-400" />
                    </button>

                    {actionRouteId === route.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-bg-800 rounded-lg shadow-lg border border-bg-700 py-1 z-[100]">
                        <button
                          onClick={() => {
                            setActionRouteId(null);
                            onEdit(route);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Edytuj
                        </button>
                        {route.assignedUser ? (
                          <button
                            onClick={() => {
                              setActionRouteId(null);
                              handleUnassign(route.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Ban size={16} />
                            Odepnij użytkownika
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActionRouteId(null);
                              setAssigningRoute({
                                routeId: route.id,
                                name: route.name,
                              });
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Users size={16} />
                            Przypisz użytkownika
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActionRouteId(null);
                            handleSoftDelete(route.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Ban size={16} />
                          Dezaktywuj
                        </button>
                        <button
                          onClick={() => {
                            setActionRouteId(null);
                            handleDelete(route.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-error-500 hover:bg-error-500/10 flex items-center gap-2"
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
