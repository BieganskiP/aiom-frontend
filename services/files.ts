import { File } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadImage = async (
  file: globalThis.File
): Promise<{ id: string }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/files/upload/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się przesłać obrazu");
  }

  return response.json();
};

export const uploadPdf = async (
  file: globalThis.File
): Promise<{ id: string }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/files/upload/pdf`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Nie udało się przesłać pliku PDF");
  }

  return response.json();
};

export const getFiles = async (): Promise<File[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/files`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy plików");
  }

  return response.json();
};

export const getFile = async (id: string): Promise<File> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać pliku");
  }

  return response.json();
};

export const downloadFile = async (id: string): Promise<Blob> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/files/${id}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać pliku");
  }

  return response.blob();
};

export const deleteFile = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się usunąć pliku");
  }
};
