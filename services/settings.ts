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
