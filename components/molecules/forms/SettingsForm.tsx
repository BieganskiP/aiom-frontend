"use client";

import { useState, useEffect } from "react";
import { TextInput } from "@/components/atoms/inputs/TextInput";
import { Button } from "@/components/atoms/buttons/Button";
import { updateSetting } from "@/services/settings";
import { SettingKey, isNumericSetting, Setting } from "@/types/settings";

interface FormData {
  [SettingKey.COMPANY_RATE_PER_STOP]: number;
  [SettingKey.COMPANY_CAR_RATE]: number;
  [SettingKey.PARENT_COMPANY_DISPLAY_NAME]: string;
  [SettingKey.OWN_COMPANY_DISPLAY_NAME]: string;
}

interface Props {
  initialSettings: Setting[];
}

export function SettingsForm({ initialSettings }: Props) {
  const [formData, setFormData] = useState<FormData>({
    [SettingKey.COMPANY_RATE_PER_STOP]: 0,
    [SettingKey.COMPANY_CAR_RATE]: 0,
    [SettingKey.PARENT_COMPANY_DISPLAY_NAME]: "",
    [SettingKey.OWN_COMPANY_DISPLAY_NAME]: "",
  });
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialSettings.length > 0) {
      const initialData: FormData = {
        [SettingKey.COMPANY_RATE_PER_STOP]:
          Number(
            initialSettings.find(
              (s) => s.key === SettingKey.COMPANY_RATE_PER_STOP
            )?.numericValue
          ) || 0,
        [SettingKey.COMPANY_CAR_RATE]:
          Number(
            initialSettings.find((s) => s.key === SettingKey.COMPANY_CAR_RATE)
              ?.numericValue
          ) || 0,
        [SettingKey.PARENT_COMPANY_DISPLAY_NAME]:
          initialSettings.find(
            (s) => s.key === SettingKey.PARENT_COMPANY_DISPLAY_NAME
          )?.textValue || "",
        [SettingKey.OWN_COMPANY_DISPLAY_NAME]:
          initialSettings.find(
            (s) => s.key === SettingKey.OWN_COMPANY_DISPLAY_NAME
          )?.textValue || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
    }
  }, [initialSettings]);

  const handleChange = (key: SettingKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: isNumericSetting(key) ? parseFloat(value) || 0 : value,
    }));
    setSuccess(false);
  };

  const getChangedSettings = () => {
    if (!initialFormData) return [];

    return Object.entries(formData)
      .filter(([key, value]) => {
        const initialValue = initialFormData[key as keyof FormData];
        return value !== initialValue;
      })
      .map(([key]) => key as SettingKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const changedSettings = getChangedSettings();
      if (changedSettings.length === 0) {
        setSuccess(true);
        return;
      }

      await Promise.all(
        changedSettings.map((key) => updateSetting(key, formData[key]))
      );
      setSuccess(true);
      setInitialFormData(formData);
    } catch (error) {
      console.error("Failed to update settings:", error);
      setError("Nie udało się zaktualizować ustawień");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Ustawienia</h2>
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

          <div className="space-y-6">
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
                    handleChange(
                      SettingKey.COMPANY_RATE_PER_STOP,
                      e.target.value
                    )
                  }
                  className="max-w-[200px]"
                  disabled={loading}
                />
                <span className="text-neutral-400 self-center">zł</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Stawka za stopa (Samochód własny)
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
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
