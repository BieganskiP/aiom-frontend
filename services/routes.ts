import { Route } from "@/types";

interface CreateRouteData {
  name: string;
  description: string;
}

export const getRoutes = async (): Promise<Route[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3001/api/v1/routes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy tras");
  }

  return response.json();
};

export const createRoute = async (data: CreateRouteData): Promise<Route> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3001/api/v1/routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się utworzyć trasy");
  }

  return response.json();
};

export const updateRoute = async (
  id: string,
  data: Partial<CreateRouteData & { active: boolean }>
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3001/api/v1/routes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się zaktualizować trasy");
  }
};

export const deleteRoute = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3001/api/v1/routes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się usunąć trasy");
  }
};

export const softDeleteRoute = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:3001/api/v1/routes/${id}/soft`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się dezaktywować trasy");
  }
};

export const assignRouteToUser = async (
  routeId: string,
  assignedUserId: string | null
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:3001/api/v1/routes/${routeId}/assign`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assignedUserId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Nie udało się przypisać trasy do użytkownika"
    );
  }
};

export const unassignRoute = async (routeId: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:3001/api/v1/routes/${routeId}/unassign`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Nie udało się odpiąć trasy od użytkownika"
    );
  }
};
