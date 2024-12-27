"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { createCar, updateCar } from "@/services/cars";
import { Car, CarOwner, CarStatus } from "@/types";
import { X } from "lucide-react";

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  car?: Car | null;
}

interface CarFormData {
  name: string;
  licensePlate: string;
  owner: CarOwner;
  status: CarStatus;
  checkupDate: string;
  oilChangeDate: string;
  tiresChangeDate: string;
  brakesChangeDate: string;
}

export const CarModal = ({
  isOpen,
  onClose,
  onSuccess,
  car,
}: CarModalProps) => {
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarFormData>();

  useEffect(() => {
    if (car) {
      reset({
        name: car.name,
        licensePlate: car.licensePlate,
        owner: car.owner,
        status: car.status,
        checkupDate: car.checkupDate?.split("T")[0] || "",
        oilChangeDate: car.oilChangeDate?.split("T")[0] || "",
        tiresChangeDate: car.tiresChangeDate?.split("T")[0] || "",
        brakesChangeDate: car.brakesChangeDate?.split("T")[0] || "",
      });
    } else {
      reset({
        owner: CarOwner.OWN_COMPANY,
        status: CarStatus.AVAILABLE,
      });
    }
  }, [car, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CarFormData) => {
    try {
      setError("");
      if (car) {
        await updateCar(car.id, data);
      } else {
        await createCar(data);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-neutral-800 mb-4">
          {car ? "Edytuj samochód" : "Dodaj samochód"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50 text-error-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <TextInput
            label="Nazwa"
            placeholder="Wprowadź nazwę samochodu"
            {...register("name", {
              required: "Nazwa jest wymagana",
            })}
            error={errors.name}
          />

          <TextInput
            label="Numer rejestracyjny"
            placeholder="Wprowadź numer rejestracyjny"
            {...register("licensePlate", {
              required: "Numer rejestracyjny jest wymagany",
              pattern: {
                value: /^[A-Z0-9 ]{4,10}$/i,
                message: "Nieprawidłowy numer rejestracyjny",
              },
            })}
            error={errors.licensePlate}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Właściciel
              </label>
              <select
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                {...register("owner", { required: "Właściciel jest wymagany" })}
              >
                <option value={CarOwner.OWN_COMPANY}>Firma własna</option>
                <option value={CarOwner.PARENT_COMPANY}>Firma matka</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">
                Status
              </label>
              <select
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                {...register("status", { required: "Status jest wymagany" })}
              >
                <option value={CarStatus.AVAILABLE}>Dostępny</option>
                <option value={CarStatus.IN_USE}>W użyciu</option>
                <option value={CarStatus.IN_REPAIR}>W naprawie</option>
                <option value={CarStatus.OUT_OF_SERVICE}>
                  Wyłączony z użytku
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Data przeglądu"
              type="date"
              {...register("checkupDate", {
                required: "Data przeglądu jest wymagana",
              })}
              error={errors.checkupDate}
            />

            <TextInput
              label="Data wymiany oleju"
              type="date"
              {...register("oilChangeDate", {
                required: "Data wymiany oleju jest wymagana",
              })}
              error={errors.oilChangeDate}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Data wymiany opon"
              type="date"
              {...register("tiresChangeDate", {
                required: "Data wymiany opon jest wymagana",
              })}
              error={errors.tiresChangeDate}
            />

            <TextInput
              label="Data wymiany hamulców"
              type="date"
              {...register("brakesChangeDate", {
                required: "Data wymiany hamulców jest wymagana",
              })}
              error={errors.brakesChangeDate}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Zapisywanie..."
                : car
                ? "Zapisz zmiany"
                : "Dodaj samochód"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
