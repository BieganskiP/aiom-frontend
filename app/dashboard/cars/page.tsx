"use client";

import { useEffect, useState } from "react";
import { Car } from "@/types";
import { getCars } from "@/services/cars";
import { getSettings } from "@/services/settings";
import { Button } from "@/components/atoms/buttons/Button";

import { CarsList } from "@/components/molecules/tables/CarsList";
import { CarModal } from "@/components/molecules/modals/CarModal";
import { Plus } from "lucide-react";
import { SettingKey } from "@/types/settings";
import PageHeader from "@/components/atoms/layout/PageHeader";

interface CompanyNames {
  parent: string;
  own: string;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyNames, setCompanyNames] = useState<CompanyNames>({
    parent: "Firma matka",
    own: "Firma własna",
  });

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
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        const parentCompanyName = settings.find(
          (s) => s.key === SettingKey.PARENT_COMPANY_DISPLAY_NAME
        )?.textValue;
        const ownCompanyName = settings.find(
          (s) => s.key === SettingKey.OWN_COMPANY_DISPLAY_NAME
        )?.textValue;

        setCompanyNames({
          parent: parentCompanyName || "Firma matka",
          own: ownCompanyName || "Firma własna",
        });
      } catch (error) {
        console.error("Failed to fetch company names:", error);
      }
    };

    Promise.all([fetchCars(), fetchSettings()]);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Samochody" />
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
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-6">
          {error}
        </div>
      )}

      <CarsList
        cars={cars}
        onUpdate={fetchCars}
        loading={loading}
        companyNames={companyNames}
      />

      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCars}
        companyNames={companyNames}
      />
    </div>
  );
}
