"use client";

import { Car, CarOwner, CarStatus } from "@/types";
import { useState } from "react";
import { MoreVertical, Pencil, Ban, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteCar, updateCarStatus } from "@/services/cars";

interface CarsListProps {
  cars: Car[];
  onUpdate: () => void;
  onEdit: (car: Car) => void;
}

export const CarsList = ({ cars, onUpdate, onEdit }: CarsListProps) => {
  const { user } = useAuth();
  const [actionCarId, setActionCarId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleSoftDelete = async (id: string) => {
    try {
      setError("");
      await updateCarStatus(id, CarStatus.OUT_OF_SERVICE);
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
    if (!window.confirm("Czy na pewno chcesz usunąć ten samochód?")) return;

    try {
      setError("");
      await deleteCar(id);
      onUpdate();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  const getStatusColor = (status: CarStatus) => {
    switch (status) {
      case CarStatus.AVAILABLE:
        return "bg-green-500/10 text-green-500";
      case CarStatus.IN_REPAIR:
        return "bg-yellow-500/10 text-yellow-500";
      case CarStatus.OUT_OF_SERVICE:
        return "bg-error-500/10 text-error-500";
      default:
        return "bg-neutral-500/10 text-neutral-500";
    }
  };

  const getStatusText = (status: CarStatus) => {
    switch (status) {
      case CarStatus.AVAILABLE:
        return "Dostępny";
      case CarStatus.IN_REPAIR:
        return "W naprawie";
      case CarStatus.OUT_OF_SERVICE:
        return "Wyłączony z użytku";
      case CarStatus.IN_USE:
        return "W użyciu";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <div className="bg-bg-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bg-700">
              <th className="text-left p-4 text-neutral-400 font-medium">
                Nazwa
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Nr rejestracyjny
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Właściciel
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Status
              </th>
              <th className="text-left p-4 text-neutral-400 font-medium">
                Data przeglądu
              </th>
              <th className="w-10 p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-700">
            {cars.map((car) => (
              <tr key={car.id} className="group">
                <td className="p-4 text-foreground">{car.name}</td>
                <td className="p-4 text-foreground">{car.licensePlate}</td>
                <td className="p-4 text-foreground">
                  {car.owner === CarOwner.OWN_COMPANY ? "Firma" : "Firma matka"}
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
                <td className="p-4 text-foreground">
                  {new Date(car.checkupDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActionCarId(actionCarId === car.id ? null : car.id)
                      }
                      className="p-2 hover:bg-bg-700 rounded-lg"
                      disabled={user?.role !== "admin"}
                    >
                      <MoreVertical size={20} className="text-neutral-400" />
                    </button>

                    {actionCarId === car.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-bg-800 rounded-lg shadow-lg border border-bg-700 py-1 z-10">
                        <button
                          onClick={() => {
                            setActionCarId(null);
                            onEdit(car);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Edytuj
                        </button>
                        <button
                          onClick={() => {
                            setActionCarId(null);
                            handleSoftDelete(car.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Ban size={16} />
                          Dezaktywuj
                        </button>
                        <button
                          onClick={() => {
                            setActionCarId(null);
                            handleDelete(car.id);
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
      </div>
    </div>
  );
};
