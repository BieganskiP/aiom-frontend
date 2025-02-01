"use client";

import { useEffect, useState } from "react";
import { File as CustomFile } from "@/types";
import { Button } from "@/components/atoms/buttons/Button";
import { Download, Trash2, Image, FileText } from "lucide-react";
import {
  getFiles,
  downloadFile,
  deleteFile,
  uploadImage,
  uploadPdf,
} from "@/services/files";
import { TableWrapper } from "@/components/atoms/layout/TableWrapper";
import PageHeader from "@/components/atoms/layout/PageHeader";

export default function DocumentsPage() {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFiles();
      setFiles(data);
    } catch (error) {
      setError("Nie udało się pobrać listy plików");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "pdf"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      if (type === "image") {
        if (!file.type.startsWith("image/")) {
          throw new Error("Proszę wybrać plik obrazu (jpg/jpeg/png)");
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Rozmiar obrazu nie może przekraczać 5MB");
        }
        await uploadImage(file);
      } else {
        if (file.type !== "application/pdf") {
          throw new Error("Proszę wybrać plik PDF");
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Rozmiar pliku PDF nie może przekraczać 10MB");
        }
        await uploadPdf(file);
      }

      await fetchFiles();
      event.target.value = "";
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił błąd podczas przesyłania pliku");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file: CustomFile) => {
    try {
      setError("");
      const blob = await downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił błąd podczas pobierania pliku");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten plik?")) return;

    try {
      setError("");
      await deleteFile(id);
      await fetchFiles();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Wystąpił błąd podczas usuwania pliku");
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-neutral-400">Ładowanie...</div>
        </div>
      </main>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Dokumenty" />
        <div className="flex gap-2">
          <div>
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={(e) => handleFileUpload(e, "image")}
              disabled={uploading}
            />
            <Button
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={uploading}
              size="sm"
              className="flex items-center gap-2"
            >
              <Image className="w-4 h-4" aria-label="Ikona obrazu" />
              <span className="hidden sm:inline">Dodaj obraz</span>
              <span className="sm:hidden">Obraz</span>
            </Button>
          </div>
          <div>
            <input
              type="file"
              id="pdf-upload"
              className="hidden"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, "pdf")}
              disabled={uploading}
            />
            <Button
              onClick={() => document.getElementById("pdf-upload")?.click()}
              disabled={uploading}
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" aria-label="Ikona PDF" />
              <span className="hidden sm:inline">Dodaj PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-6">
          {error}
        </div>
      )}

      <div className="bg-bg-800 rounded-lg">
        <TableWrapper>
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-700">
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Nazwa
                </th>
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Typ
                </th>
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Rozmiar
                </th>
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Data dodania
                </th>
                <th className="w-20 p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-700">
              {files.map((file) => (
                <tr key={file.id} className="group">
                  <td className="p-4 text-foreground">{file.originalName}</td>
                  <td className="p-4 text-foreground">
                    {file.type === "image" ? "Obraz" : "PDF"}
                  </td>
                  <td className="p-4 text-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="p-4 text-foreground">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 hover:bg-bg-700 rounded-lg text-neutral-400 hover:text-neutral-200"
                      >
                        <Download size={20} aria-label="Pobierz plik" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 hover:bg-error-500/10 rounded-lg text-error-500"
                      >
                        <Trash2 size={20} aria-label="Usuń plik" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-neutral-400">
                    Brak plików
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  );
}
