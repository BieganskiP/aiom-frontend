"use client";

import { Car } from "@/types";
import { deleteCar, softDeleteCar } from "@/services/cars";
import { MoreVertical, Pencil, Trash2, Ban } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface CarsListProps {
  cars: Car[];
  onUpdate: () => void;
  onEdit: (car: Car) => void;
}

export const CarsList = ({ cars, onUpdate, onEdit }: CarsListProps) => {
  const { user } = useAuth();
  const [actionCarId, setActionCarId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

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

  const handleSoftDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz dezaktywować ten samochód?"))
      return;

    try {
      setError("");
      await softDeleteCar(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się dezaktywować samochodu");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {error && (
        <div className="bg-error-50 text-error-500 p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Nazwa
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Numer rejestracyjny
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Przypisany kierowca
            </th>
            <th className="text-left p-4 text-sm font-medium text-neutral-600">
              Status
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr
              key={car.id}
              className="border-b border-neutral-200 last:border-0"
            >
              <td className="p-4">
                <div className="font-medium text-neutral-900">{car.name}</div>
              </td>
              <td className="p-4 text-neutral-600">{car.licensePlate}</td>
              <td className="p-4 text-neutral-600">
                {car.assignedUser
                  ? `${car.assignedUser.firstName} ${car.assignedUser.lastName}`
                  : "Brak"}
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    car.active
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {car.active ? "Aktywny" : "Nieaktywny"}
                </span>
              </td>
              <td className="p-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setActionCarId(actionCarId === car.id ? null : car.id)
                    }
                    className="p-2 hover:bg-neutral-50 rounded-lg"
                    disabled={user?.role !== "admin"}
                  >
                    <MoreVertical size={20} className="text-neutral-400" />
                  </button>

                  {actionCarId === car.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                      <button
                        onClick={() => {
                          setActionCarId(null);
                          onEdit(car);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        Edytuj
                      </button>
                      <button
                        onClick={() => {
                          setActionCarId(null);
                          handleSoftDelete(car.id);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <Ban size={16} />
                        Dezaktywuj
                      </button>
                      <button
                        onClick={() => {
                          setActionCarId(null);
                          handleDelete(car.id);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2"
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
    </div>
  );
};
