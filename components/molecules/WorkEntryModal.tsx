"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { createWorkEntry, updateWorkEntry } from "@/services/workEntries";
import { WorkEntry, Route, Car } from "@/types";
import { X } from "lucide-react";
import { getCars } from "@/services/cars";
import { getRoutes } from "@/services/routes";
import { useAuth } from "@/contexts/AuthContext";

interface WorkEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entry?: WorkEntry | null;
}

interface WorkEntryFormData {
  stopsCompleted: string;
  workDate: string;
  routeId?: string;
  carId?: string;
}

export const WorkEntryModal = ({
  isOpen,
  onClose,
  onSuccess,
  entry,
}: WorkEntryModalProps) => {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkEntryFormData>({
    defaultValues: {
      workDate: entry?.workDate || new Date().toISOString().split("T")[0],
      stopsCompleted: entry?.stopsCompleted.toString() || "",
      routeId: entry?.routeId || user?.routeId || undefined,
      carId: entry?.carId || user?.carId || undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [routesData, carsData] = await Promise.all([
          getRoutes(),
          getCars(),
        ]);
        setRoutes(routesData);
        setCars(carsData);
      } catch (error) {
        setError("Nie udało się pobrać danych");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      reset({
        workDate: entry?.workDate || new Date().toISOString().split("T")[0],
        stopsCompleted: entry?.stopsCompleted.toString() || "",
        routeId: entry?.routeId || user?.routeId || undefined,
        carId: entry?.carId || user?.carId || undefined,
      });
    }
  }, [isOpen, entry, reset, user]);

  if (!isOpen) return null;

  const onSubmit = async (data: WorkEntryFormData) => {
    try {
      setError("");
      const submitData = {
        ...data,
        stopsCompleted: parseInt(data.stopsCompleted, 10),
        routeId: data.routeId || undefined,
        carId: data.carId || undefined,
        userId: user?.id,
      };

      if (entry) {
        await updateWorkEntry(entry.id, submitData);
      } else {
        await createWorkEntry(submitData);
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-bg-800 rounded-lg p-6">
          <div className="text-neutral-400">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4">
          {entry ? "Edytuj wpis pracy" : "Dodaj wpis pracy"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <TextInput
            type="date"
            label="Data pracy"
            {...register("workDate", {
              required: "Data jest wymagana",
            })}
            error={errors.workDate}
          />

          <TextInput
            type="number"
            label="Liczba wykonanych przystanków"
            {...register("stopsCompleted", {
              required: "Liczba przystanków jest wymagana",
              min: {
                value: 1,
                message: "Minimalna liczba przystanków to 1",
              },
            })}
            error={errors.stopsCompleted}
          />

          <div>
            <label className="text-sm font-medium text-neutral-200">
              Trasa
            </label>
            <select
              className="mt-1 w-full rounded-lg border bg-bg-700 border-bg-700 px-3 py-2 text-sm text-foreground"
              {...register("routeId")}
            >
              <option value="">Brak trasy</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-200">
              Samochód
            </label>
            <select
              className="mt-1 w-full rounded-lg border bg-bg-700 border-bg-700 px-3 py-2 text-sm text-foreground"
              {...register("carId")}
            >
              <option value="">Brak samochodu</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} ({car.licensePlate})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Zapisywanie..."
                : entry
                ? "Zapisz zmiany"
                : "Dodaj wpis"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
