import { WorkEntry, CreateWorkEntryData, WorkEntriesFilters } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createWorkEntry = async (
  data: CreateWorkEntryData
): Promise<WorkEntry> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/work-entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się utworzyć wpisu");
  }

  return response.json();
};

export const getMyWorkEntries = async (
  month?: string
): Promise<WorkEntry[]> => {
  const token = localStorage.getItem("token");
  const url = new URL(`${API_BASE_URL}/work-entries/my-entries`);
  if (month) {
    url.searchParams.append("month", month);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać wpisów");
  }

  return response.json();
};

export const getAllWorkEntries = async (
  filters?: WorkEntriesFilters
): Promise<WorkEntry[]> => {
  const token = localStorage.getItem("token");
  const url = new URL(`${API_BASE_URL}/work-entries`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać wpisów");
  }

  return response.json();
};

export const updateWorkEntry = async (
  id: string,
  data: Partial<CreateWorkEntryData>
): Promise<WorkEntry> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/work-entries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się zaktualizować wpisu");
  }

  return response.json();
};

export const deleteWorkEntry = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/work-entries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się usunąć wpisu");
  }
};
