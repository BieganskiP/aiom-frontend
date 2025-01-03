"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { createCar, updateCar } from "@/services/cars";
import { Car, CarOwner, CarStatus } from "@/types";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface CompanyNames {
  parent: string;
  own: string;
}

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  car?: Car | null;
  companyNames: CompanyNames;
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
  companyNames,
}: CarModalProps) => {
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarFormData>({
    defaultValues: car
      ? {
          ...car,
          checkupDate: car.checkupDate?.split("T")[0] || "",
          oilChangeDate: car.oilChangeDate?.split("T")[0] || "",
          tiresChangeDate: car.tiresChangeDate?.split("T")[0] || "",
          brakesChangeDate: car.brakesChangeDate?.split("T")[0] || "",
        }
      : {
          owner: CarOwner.OWN_COMPANY,
          status: CarStatus.AVAILABLE,
          checkupDate: "",
          oilChangeDate: "",
          tiresChangeDate: "",
          brakesChangeDate: "",
        },
  });

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  useEffect(() => {
    if (car) {
      reset({
        ...car,
        checkupDate: car.checkupDate?.split("T")[0] || "",
        oilChangeDate: car.oilChangeDate?.split("T")[0] || "",
        tiresChangeDate: car.tiresChangeDate?.split("T")[0] || "",
        brakesChangeDate: car.brakesChangeDate?.split("T")[0] || "",
      });
    } else {
      reset({
        owner: CarOwner.OWN_COMPANY,
        status: CarStatus.AVAILABLE,
        checkupDate: "",
        oilChangeDate: "",
        tiresChangeDate: "",
        brakesChangeDate: "",
      });
    }
  }, [car, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CarFormData) => {
    try {
      setError("");
      const submitData = {
        ...data,
        checkupDate: data.checkupDate || "",
        oilChangeDate: data.oilChangeDate || "",
        tiresChangeDate: data.tiresChangeDate || "",
        brakesChangeDate: data.brakesChangeDate || "",
      };

      if (car) {
        await updateCar(car.id, submitData);
      } else {
        await createCar(submitData);
      }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-bg-800 rounded-lg p-4 md:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4">
          {car ? "Edytuj samochód" : "Dodaj samochód"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nazwa"
              placeholder="Wprowadź nazwę"
              {...register("name", {
                required: "Nazwa jest wymagana",
              })}
              error={errors.name}
            />

            <TextInput
              label="Numer rejestracyjny"
              placeholder="Wprowadź numer"
              {...register("licensePlate", {
                required: "Numer rejestracyjny jest wymagany",
              })}
              error={errors.licensePlate}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 block">
                Właściciel
              </label>
              <select
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                {...register("owner", {
                  required: "Właściciel jest wymagany",
                })}
              >
                <option value={CarOwner.OWN_COMPANY}>{companyNames.own}</option>
                <option value={CarOwner.PARENT_COMPANY}>
                  {companyNames.parent}
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-200 mb-1 block">
                Status
              </label>
              <select
                className="w-full rounded-lg border bg-bg-700 border-bg-700 px-4 py-2.5 text-foreground"
                {...register("status", {
                  required: "Status jest wymagany",
                })}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Data przeglądu (opcjonalne)"
              type="date"
              className="w-full"
              {...register("checkupDate")}
              error={errors.checkupDate}
            />

            <TextInput
              label="Data wymiany oleju (opcjonalne)"
              type="date"
              className="w-full"
              {...register("oilChangeDate")}
              error={errors.oilChangeDate}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Data wymiany opon (opcjonalne)"
              type="date"
              className="w-full"
              {...register("tiresChangeDate")}
              error={errors.tiresChangeDate}
            />

            <TextInput
              label="Data wymiany hamulców (opcjonalne)"
              type="date"
              className="w-full"
              {...register("brakesChangeDate")}
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
