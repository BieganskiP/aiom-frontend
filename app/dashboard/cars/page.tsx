"use client";

import { useEffect, useState } from "react";
import { Car } from "@/types";
import { getCars } from "@/services/cars";
import { Button } from "@/components/atoms/Button";
import { CarsList } from "@/components/molecules/CarsList";
import { CarModal } from "@/components/molecules/CarModal";
import { Plus } from "lucide-react";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCars();
      setCars(data);
    } catch (error) {
      setError("Nie udało się pobrać listy samochodów");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCar(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-neutral-400">Ładowanie...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Samochody</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Dodaj samochód</span>
            <span className="sm:hidden">Dodaj</span>
          </Button>
        </div>

        {error && (
          <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
            {error}
          </div>
        )}

        <CarsList cars={cars} onUpdate={fetchCars} onEdit={handleEdit} />

        <CarModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={fetchCars}
          car={editingCar}
        />
      </div>
    </main>
  );
}
