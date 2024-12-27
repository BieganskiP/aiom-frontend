"use client";

import { useState, useEffect } from "react";
import { User, Car, Route } from "@/types";
import { deleteUser, toggleUserActive, updateUserRole } from "@/services/users";
import { getCars, assignCarToUser, unassignCar } from "@/services/cars";
import { getRoutes, assignRouteToUser, unassignRoute } from "@/services/routes";
import { MoreVertical, Trash2, X, DollarSign, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PaidPerStopModal } from "./PaidPerStopModal";
import { UserDetailsModal } from "./UserDetailsModal";

interface UsersListProps {
  users: User[];
  onUserUpdate: () => void;
}

export const UsersList = ({ users, onUserUpdate }: UsersListProps) => {
  const { user: currentUser } = useAuth();
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [cars, setCars] = useState<Car[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPaidPerStop, setEditingPaidPerStop] = useState<User | null>(
    null
  );
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, routesData] = await Promise.all([
          getCars(),
          getRoutes(),
        ]);
        setCars(carsData);
        setRoutes(routesData);
      } catch (err) {
        setError("Nie udało się pobrać danych");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleActive = async (userId: string, active: boolean) => {
    try {
      setError("");
      await toggleUserActive(userId, active);
      onUserUpdate();
    } catch (err) {
      setError("Nie udało się zmienić statusu użytkownika");
      console.error(err);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      setError("");
      await updateUserRole(userId, role);
      onUserUpdate();
    } catch (err) {
      setError("Nie udało się zmienić roli użytkownika");
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      setError("");
      await deleteUser(userId);
      onUserUpdate();
    } catch (err) {
      setError("Nie udało się usunąć użytkownika");
      console.error(err);
    }
  };

  const handleCarAssignment = async (userId: string, carId: string | null) => {
    try {
      setError("");
      // Find current assigned car
      const currentAssignedCar = cars.find(
        (car) => car.assignedUserId === userId
      );

      console.log("Car assignment:", {
        userId,
        carId,
        currentAssignedCar,
      });

      if (currentAssignedCar) {
        console.log("Unassigning current car:", currentAssignedCar.id);
        await assignCarToUser(currentAssignedCar.id, null);
      }

      // Only try to assign if we have a non-empty carId
      if (carId && carId !== "") {
        console.log("Assigning new car:", carId);
        await assignCarToUser(carId, userId);
      }

      onUserUpdate();
    } catch (error) {
      console.error("Car assignment error:", error);
      setError("Nie udało się przypisać samochodu");
    }
  };

  const handleRouteAssignment = async (
    userId: string,
    routeId: string | null
  ) => {
    try {
      setError("");
      // Find current assigned route
      const currentAssignedRoute = routes.find(
        (route) => route.assignedUserId === userId
      );

      console.log("Route assignment:", {
        userId,
        routeId,
        currentAssignedRoute,
      });

      if (currentAssignedRoute) {
        console.log("Unassigning current route:", currentAssignedRoute.id);
        await assignRouteToUser(currentAssignedRoute.id, null);
      }

      // Only try to assign if we have a non-empty routeId
      if (routeId && routeId !== "") {
        console.log("Assigning new route:", routeId);
        await assignRouteToUser(routeId, userId);
      }

      onUserUpdate();
    } catch (error) {
      console.error("Route assignment error:", error);
      setError("Nie udało się przypisać trasy");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-neutral-600">Ładowanie danych...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {error && (
        <div className="bg-error-50 text-error-500 p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="p-4 text-sm text-neutral-600">
        <div>Liczba samochodów: {cars.length}</div>
        <div>Liczba tras: {routes.length}</div>
        <div>Current user ID: {currentUser?.id}</div>
      </div>

      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Użytkownik
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Rola
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Status
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Samochód
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Trasa
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Stawka
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = user.id === currentUser?.id;
            console.log(`User ${user.id}:`, {
              isCurrentUser,
              currentUserId: currentUser?.id,
              isAdmin: currentUser?.role === "admin",
            });

            return (
              <tr
                key={user.id}
                className="border-b border-neutral-200 last:border-0"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium text-neutral-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingUser(user)}
                      className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600"
                      title="Zobacz szczegóły"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <select
                    className="w-full max-w-[150px] rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={isCurrentUser || currentUser?.role !== "admin"}
                  >
                    <option value="user">Użytkownik</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>
                <td className="p-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.active}
                      onChange={(e) =>
                        handleToggleActive(user.id, e.target.checked)
                      }
                      disabled={isCurrentUser || currentUser?.role !== "admin"}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 items-center">
                    <select
                      className="w-full max-w-[200px] rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                      value={user.carId || ""}
                      onChange={(e) =>
                        handleCarAssignment(user.id, e.target.value || null)
                      }
                      disabled={currentUser?.role !== "admin"}
                    >
                      <option value="">Brak samochodu</option>
                      {cars.length === 0 && (
                        <option disabled={true}>
                          Brak dostępnych samochodów
                        </option>
                      )}
                      {cars.map((car) => (
                        <option
                          key={car.id}
                          value={car.id}
                          disabled={Boolean(
                            car.assignedUserId && car.assignedUserId !== user.id
                          )}
                        >
                          {car.name} ({car.licensePlate})
                        </option>
                      ))}
                    </select>
                    {user.carId && (
                      <button
                        onClick={async () => {
                          try {
                            await unassignCar(user.carId!);
                            onUserUpdate();
                          } catch (error) {
                            setError("Nie udało się odpiąć samochodu");
                            console.error(error);
                          }
                        }}
                        className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600"
                        disabled={currentUser?.role !== "admin"}
                        title="Usuń przypisanie samochodu"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 items-center">
                    <select
                      className="w-full max-w-[200px] rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                      value={user.routeId || ""}
                      onChange={(e) =>
                        handleRouteAssignment(user.id, e.target.value || null)
                      }
                      disabled={currentUser?.role !== "admin"}
                    >
                      <option value="">Brak trasy</option>
                      {routes.length === 0 && (
                        <option disabled={true}>Brak dostępnych tras</option>
                      )}
                      {routes.map((route) => (
                        <option
                          key={route.id}
                          value={route.id}
                          disabled={Boolean(
                            route.assignedUserId &&
                              route.assignedUserId !== user.id
                          )}
                        >
                          {route.name}
                        </option>
                      ))}
                    </select>
                    {user.routeId && (
                      <button
                        onClick={async () => {
                          try {
                            await unassignRoute(user.routeId!);
                            onUserUpdate();
                          } catch (error) {
                            setError("Nie udało się odpiąć trasy");
                            console.error(error);
                          }
                        }}
                        className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600"
                        disabled={currentUser?.role !== "admin"}
                        title="Usuń przypisanie trasy"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-600">
                      {user.paidPerStop.toFixed(2)} zł
                    </span>
                    {currentUser?.role === "admin" && (
                      <button
                        onClick={() => setEditingPaidPerStop(user)}
                        className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600"
                        title="Edytuj stawkę"
                      >
                        <DollarSign size={20} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActionUserId(
                          actionUserId === user.id ? null : user.id
                        )
                      }
                      className="p-2 hover:bg-neutral-50 rounded-lg"
                      disabled={isCurrentUser || currentUser?.role !== "admin"}
                    >
                      <MoreVertical size={20} className="text-neutral-400" />
                    </button>

                    {actionUserId === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Usuń użytkownika
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <UserDetailsModal
        isOpen={Boolean(viewingUser)}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
      />

      <PaidPerStopModal
        isOpen={Boolean(editingPaidPerStop)}
        onClose={() => setEditingPaidPerStop(null)}
        onSuccess={onUserUpdate}
        userId={editingPaidPerStop?.id || ""}
        currentValue={editingPaidPerStop?.paidPerStop || 0}
        userName={
          editingPaidPerStop
            ? `${editingPaidPerStop.firstName} ${editingPaidPerStop.lastName}`
            : ""
        }
      />
    </div>
  );
};
