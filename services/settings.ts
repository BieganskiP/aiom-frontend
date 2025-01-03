import { Setting, SettingKey } from "@/types/settings";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  city: string;
  postCode: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        `Aktualizacja profilu nie powiodła się (${response.status})`
    );
  }
};

export const changePassword = async (
  data: ChangePasswordData
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Zmiana hasła nie powiodła się (${response.status})`
    );
  }
};

export const getSettings = async (): Promise<Setting[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Nie udało się pobrać ustawień (${response.status})`
    );
  }

  return response.json();
};

export const updateSetting = async (
  key: SettingKey,
  value: number | string
): Promise<Setting> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        `Nie udało się zaktualizować ustawienia (${response.status})`
    );
  }

  return response.json();
};
