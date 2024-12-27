import { User } from "@/types";

interface InviteUserData {
  email: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  city?: string;
  postCode?: string;
  street?: string;
  houseNumber?: string;
  phoneNumber?: string;
  role?: string;
  active?: boolean;
  carId?: string | null;
  routeId?: string | null;
  paidPerStop?: number;
}

export const inviteUser = async (data: InviteUserData): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3001/api/v1/auth/invite", {
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
      errorData?.message ||
        `Nie udało się zaprosić użytkownika (${response.status})`
    );
  }
};

export const getUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3001/api/v1/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy użytkowników");
  }

  return response.json();
};

export const updateUser = async (
  id: string,
  data: UpdateUserData
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
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
        `Nie udało się zaktualizować użytkownika (${response.status})`
    );
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się usunąć użytkownika");
  }
};

export const toggleUserActive = async (
  id: string,
  active: boolean
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:3001/api/v1/users/${id}/toggle-active`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active }),
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zmienić statusu użytkownika");
  }
};

export const updateUserRole = async (
  id: string,
  role: string
): Promise<void> => {
  await updateUser(id, { role });
};

export const updateUserPaidPerStop = async (
  userId: string,
  paidPerStop: number
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:3001/api/v1/users/${userId}/paid-per-stop`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paidPerStop }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Nie udało się zaktualizować stawki za przystanek"
    );
  }
};
