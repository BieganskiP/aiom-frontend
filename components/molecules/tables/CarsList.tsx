"use client";

import { Car, CarOwner, CarStatus, User } from "@/types";
import { useState, useEffect } from "react";
import { Pencil, Ban, Trash2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteCar, updateCarStatus, unassignCar } from "@/services/cars";
import { getUsers } from "@/services/users";
import { AssignCarModal } from "@/components/molecules/modals/AssignCarModal";
import { DropdownMenu } from "@/components/atoms/inputs/DropdownMenu";
import { CarModal } from "@/components/molecules/modals/CarModal";

interface CompanyNames {
  parent: string;
  own: string;
}

interface CarsListProps {
  cars: Car[];
  onUpdate: () => void;
  loading?: boolean;
  companyNames: CompanyNames;
}

export function CarsList({
  cars,
  onUpdate,
  loading = false,
  companyNames,
}: CarsListProps) {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [assigningCar, setAssigningCar] = useState<{
    carId: string;
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
    if (!window.confirm("Czy na pewno chcesz usunąć ten samochód?")) return;

    try {
      setError("");
      await deleteCar(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć samochodu");
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, status: CarStatus) => {
    try {
      setError("");
      await updateCarStatus(id, status);
      onUpdate();
    } catch (error) {
      setError("Nie udało się zmienić statusu samochodu");
      console.error(error);
    }
  };

  const handleUnassign = async (carId: string) => {
    if (!window.confirm("Czy na pewno chcesz odpiąć samochód od użytkownika?"))
      return;

    try {
      setError("");
      await unassignCar(carId);
      onUpdate();
    } catch (error) {
      setError("Nie udało się odpiąć samochodu");
      console.error(error);
    }
  };

  const getStatusText = (status: CarStatus) => {
    switch (status) {
      case CarStatus.AVAILABLE:
        return "Dostępny";
      case CarStatus.IN_USE:
        return "W użyciu";
      case CarStatus.IN_REPAIR:
        return "W naprawie";
      case CarStatus.OUT_OF_SERVICE:
        return "Wyłączony";
      default:
        return "Nieznany";
    }
  };

  const getStatusColor = (status: CarStatus) => {
    switch (status) {
      case CarStatus.AVAILABLE:
        return "bg-green-500/10 text-green-500";
      case CarStatus.IN_USE:
        return "bg-primary-500/10 text-primary-500";
      case CarStatus.IN_REPAIR:
        return "bg-yellow-500/10 text-yellow-500";
      case CarStatus.OUT_OF_SERVICE:
        return "bg-neutral-500/10 text-neutral-400";
      default:
        return "bg-neutral-500/10 text-neutral-400";
    }
  };

  const getOwnerDisplayName = (owner: CarOwner) => {
    return owner === CarOwner.PARENT_COMPANY
      ? companyNames.parent
      : companyNames.own;
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
                  Nazwa
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Nr rejestracyjny
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Właściciel
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-400">
                  Kierowca
                </th>
                <th className="text-right p-4 text-sm font-medium text-neutral-400">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-neutral-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-neutral-400">
                    Brak samochodów
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id} className="group">
                    <td className="p-4 text-foreground truncate">{car.name}</td>
                    <td className="p-4 text-foreground truncate">
                      {car.licensePlate}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(
                          car.status
                        )}`}
                      >
                        {getStatusText(car.status)}
                      </span>
                    </td>
                    <td className="p-4 text-foreground truncate">
                      {getOwnerDisplayName(car.owner)}
                    </td>
                    <td className="p-4 text-foreground truncate">
                      {car.assignedUser
                        ? `${car.assignedUser.firstName} ${car.assignedUser.lastName}`
                        : "-"}
                    </td>
                    <td className="p-4">
                      {user?.role === "admin" && (
                        <DropdownMenu>
                          <button
                            onClick={() => setEditingCar(car)}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                          >
                            <Pencil size={16} />
                            Edytuj
                          </button>
                          {car.assignedUser ? (
                            <button
                              onClick={() => handleUnassign(car.id)}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Users size={16} />
                              Odepnij kierowcę
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setAssigningCar({
                                  carId: car.id,
                                })
                              }
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Users size={16} />
                              Przypisz kierowcę
                            </button>
                          )}
                          {car.status !== CarStatus.OUT_OF_SERVICE ? (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  car.id,
                                  CarStatus.OUT_OF_SERVICE
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Ban size={16} />
                              Wyłącz z użytku
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(car.id, CarStatus.AVAILABLE)
                              }
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Ban size={16} />
                              Przywróć do użytku
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="w-full px-4 py-2 text-left text-sm text-error-500 hover:bg-error-500/10 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Usuń
                          </button>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingCar && (
        <CarModal
          isOpen={true}
          onClose={() => setEditingCar(null)}
          onSuccess={onUpdate}
          car={editingCar}
          companyNames={companyNames}
        />
      )}

      {assigningCar && (
        <AssignCarModal
          isOpen={true}
          onClose={() => setAssigningCar(null)}
          onSuccess={onUpdate}
          carId={assigningCar.carId}
          users={users}
        />
      )}
    </div>
  );
}
