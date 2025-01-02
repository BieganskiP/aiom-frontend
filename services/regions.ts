import { Region, Route } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CreateRegionData {
  name: string;
  description?: string;
  leaderId?: string;
}

interface UpdateRegionData {
  name?: string;
  description?: string;
  leaderId?: string;
}

export const getRegions = async (): Promise<Region[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy regionów");
  }

  return response.json();
};

export const getMyRegions = async (): Promise<Region[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/my-regions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy regionów");
  }

  return response.json();
};

export const getRegion = async (id: string): Promise<Region> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać szczegółów regionu");
  }

  return response.json();
};

export const createRegion = async (data: CreateRegionData): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions`, {
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
        `Nie udało się utworzyć regionu (${response.status})`
    );
  }
};

export const updateRegion = async (
  id: string,
  data: UpdateRegionData
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${id}`, {
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
        `Nie udało się zaktualizować regionu (${response.status})`
    );
  }
};

export const deleteRegion = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się usunąć regionu");
  }
};

export const getRegionRoutes = async (regionId: string): Promise<Route[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${regionId}/routes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać tras dla regionu");
  }

  return response.json();
};

export const addRoutesToRegion = async (
  regionId: string,
  routeIds: string[]
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${regionId}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ routeIds }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        `Nie udało się dodać tras do regionu (${response.status})`
    );
  }
};

export const removeRouteFromRegion = async (
  regionId: string,
  routeId: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/regions/${regionId}/routes/${routeId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć trasy z regionu");
  }
};

export const assignLeaderToRegion = async (
  regionId: string,
  leaderId: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${regionId}/leader`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ leaderId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        `Nie udało się przypisać lidera do regionu (${response.status})`
    );
  }
};

export const removeLeaderFromRegion = async (
  regionId: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/regions/${regionId}/leader`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        `Nie udało się usunąć lidera z regionu (${response.status})`
    );
  }
};
