"use client";

import { useState, useEffect } from "react";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { getSettings, updateSetting } from "@/services/settings";
import { SettingKey, isNumericSetting } from "@/types/settings";

interface FormData {
  [SettingKey.COMPANY_RATE_PER_STOP]: number;
  [SettingKey.COMPANY_CAR_RATE]: number;
  [SettingKey.PARENT_COMPANY_DISPLAY_NAME]: string;
  [SettingKey.OWN_COMPANY_DISPLAY_NAME]: string;
}

export function SettingsForm() {
  const [formData, setFormData] = useState<FormData>({
    [SettingKey.COMPANY_RATE_PER_STOP]: 0,
    [SettingKey.COMPANY_CAR_RATE]: 0,
    [SettingKey.PARENT_COMPANY_DISPLAY_NAME]: "",
    [SettingKey.OWN_COMPANY_DISPLAY_NAME]: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (key: SettingKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: isNumericSetting(key) ? parseFloat(value) || 0 : value,
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
      await Promise.all(
        Object.entries(formData).map(([key, value]) =>
          updateSetting(key as SettingKey, value)
        )
      );
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
          [SettingKey.COMPANY_RATE_PER_STOP]:
            Number(
              settings.find((s) => s.key === SettingKey.COMPANY_RATE_PER_STOP)
                ?.value
            ) || 0,
          [SettingKey.COMPANY_CAR_RATE]:
            Number(
              settings.find((s) => s.key === SettingKey.COMPANY_CAR_RATE)?.value
            ) || 0,
          [SettingKey.PARENT_COMPANY_DISPLAY_NAME]:
            settings
              .find((s) => s.key === SettingKey.PARENT_COMPANY_DISPLAY_NAME)
              ?.value?.toString() || "",
          [SettingKey.OWN_COMPANY_DISPLAY_NAME]:
            settings
              .find((s) => s.key === SettingKey.OWN_COMPANY_DISPLAY_NAME)
              ?.value?.toString() || "",
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
                value={formData[SettingKey.COMPANY_RATE_PER_STOP]}
                onChange={(e) =>
                  handleChange(SettingKey.COMPANY_RATE_PER_STOP, e.target.value)
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
                value={formData[SettingKey.COMPANY_CAR_RATE]}
                onChange={(e) =>
                  handleChange(SettingKey.COMPANY_CAR_RATE, e.target.value)
                }
                className="max-w-[200px]"
                disabled={loading}
              />
              <span className="text-neutral-400 self-center">zł</span>
            </div>
          </div>

          {/* Parent Company Display Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Nazwa firmy (rodzic)
            </label>
            <TextInput
              value={formData[SettingKey.PARENT_COMPANY_DISPLAY_NAME]}
              onChange={(e) =>
                handleChange(
                  SettingKey.PARENT_COMPANY_DISPLAY_NAME,
                  e.target.value
                )
              }
              className="max-w-[200px]"
              disabled={loading}
            />
          </div>

          {/* Own Company Display Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Nazwa firmy (własna)
            </label>
            <TextInput
              value={formData[SettingKey.OWN_COMPANY_DISPLAY_NAME]}
              onChange={(e) =>
                handleChange(
                  SettingKey.OWN_COMPANY_DISPLAY_NAME,
                  e.target.value
                )
              }
              className="max-w-[200px]"
              disabled={loading}
            />
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
