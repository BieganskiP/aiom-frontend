import { Car, CarOwner, CarStatus } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CreateCarData {
  name: string;
  licensePlate: string;
  owner: CarOwner;
  status: CarStatus;
  checkupDate: string;
  oilChangeDate: string;
  tiresChangeDate: string;
  brakesChangeDate: string;
}

export const getCars = async (): Promise<Car[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cars`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy samochodów");
  }

  const data = await response.json();
  return data;
};

export const assignCar = async (
  carId: string,
  assignedUserId: string | null
) => {
  const response = await fetch(`/api/v1/cars/${carId}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignedUserId }),
  });

  if (!response.ok) {
    throw new Error("Nie udało się przypisać samochodu");
  }
};

export const unassignCar = async (carId: string) => {
  const response = await fetch(`/api/v1/cars/${carId}/unassign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się odpiąć samochodu");
  }
};

export const createCar = async (data: CreateCarData): Promise<Car> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się utworzyć samochodu");
  }

  return response.json();
};

export const updateCar = async (
  id: string,
  data: Partial<CreateCarData>
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
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
      errorData?.message || "Nie udało się zaktualizować samochodu"
    );
  }
};

export const deleteCar = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się usunąć samochodu");
  }
};

export const softDeleteCar = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cars/${id}/soft`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się dezaktywować samochodu");
  }
};

export const updateCarStatus = async (
  id: string,
  status: CarStatus
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cars/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Nie udało się zaktualizować statusu samochodu"
    );
  }
};
