"use client";

import { useState, useEffect } from "react";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { getSettings, updateSetting } from "@/services/settings";

interface FormData {
  company_rate_per_stop: number;
  company_car_rate: number;
}

export function SettingsForm() {
  const [formData, setFormData] = useState<FormData>({
    company_rate_per_stop: 0,
    company_car_rate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update all settings in parallel
      await Promise.all([
        updateSetting("company_rate_per_stop", formData.company_rate_per_stop),
        updateSetting("company_car_rate", formData.company_car_rate),
      ]);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to update settings:", error);
      setError("Nie udało się zaktualizować ustawień");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        const initialData: FormData = {
          company_rate_per_stop:
            settings.find((s) => s.key === "company_rate_per_stop")?.value || 0,
          company_car_rate:
            settings.find((s) => s.key === "company_car_rate")?.value || 0,
        };
        setFormData(initialData);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setError("Nie udało się pobrać ustawień");
      }
    };

    fetchSettings();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-bg-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Stawki za przystanki</h2>
        <div className="space-y-6">
          {error && (
            <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success-50/10 text-success-500 p-3 rounded-lg text-sm border border-success-500/20">
              Ustawienia zostały zaktualizowane
            </div>
          )}

          {/* Company Rate Per Stop */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Stawka za stopa (samochód od CL)
            </label>
            <div className="flex gap-4">
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={formData.company_rate_per_stop}
                onChange={(e) =>
                  handleChange("company_rate_per_stop", e.target.value)
                }
                className="max-w-[200px]"
                disabled={loading}
              />
              <span className="text-neutral-400 self-center">zł</span>
            </div>
          </div>

          {/* Company Car Rate */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Stawka za samochód (Samochód własny)
            </label>
            <div className="flex gap-4">
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={formData.company_car_rate}
                onChange={(e) =>
                  handleChange("company_car_rate", e.target.value)
                }
                className="max-w-[200px]"
                disabled={loading}
              />
              <span className="text-neutral-400 self-center">zł</span>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              Zapisz zmiany
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
