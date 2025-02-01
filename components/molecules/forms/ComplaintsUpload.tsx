"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { read, utils } from "xlsx";
import { Button } from "@/components/atoms/buttons/Button";
import { Trash2, Upload } from "lucide-react";

import { createComplaints, CreateComplaintData } from "@/services/complaints";
import { parse, isValid, format } from "date-fns";

interface ProcessedFile {
  file: File;
  data: CreateComplaintData[];
  error?: string;
}

interface ExcelRow {
  "Numer reklamacji": number;
  "Klient Maczfit / Dietly": string;
  "Opis problemu": string;
  "Rodzaj problemu": string;
  " Wartość rekompensaty ": string | number;
  Kurier: string;
  Adres: string;
  "Data dostawy": string | Date;
}

export default function ComplaintsUpload() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const processExcelFile = async (file: File): Promise<ProcessedFile> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<ExcelRow>(worksheet);

      console.log("Raw Excel data:", jsonData);

      const processedData = jsonData.map((row: ExcelRow) => {
        // Normalize compensation value
        const compensationValue = row[" Wartość rekompensaty "];
        let normalizedValue: number | null = null;

        console.log("Processing row:", row);
        console.log(
          "Raw compensation value:",
          compensationValue,
          "Type:",
          typeof compensationValue
        );

        if (
          compensationValue !== undefined &&
          compensationValue !== null &&
          compensationValue !== ""
        ) {
          if (typeof compensationValue === "string") {
            // Remove 'zł' and any whitespace, and replace comma with dot
            const cleanedValue = compensationValue
              .replace(/[złzŁZŁ\s]/gi, "") // Remove zł in any case and whitespace
              .replace(",", ".");

            console.log("Cleaned value:", cleanedValue);

            // Try to convert to number
            const parsedValue = parseFloat(cleanedValue);
            console.log("Parsed value:", parsedValue);

            if (!isNaN(parsedValue)) {
              normalizedValue = Number(parsedValue.toFixed(2));
            }
          } else if (typeof compensationValue === "number") {
            // If it's already a number, just round it to 2 decimal places
            normalizedValue = Number(compensationValue.toFixed(2));
          }
        }

        console.log("Final normalized value:", normalizedValue);

        // Parse delivery date
        let deliveryDate = null;
        const rawDate = row["Data dostawy"];

        if (rawDate) {
          // Try different date formats
          const possibleFormats = [
            "yyyy-MM-dd", // 2025-01-01
            "d.MM.yyyy", // 7.01.2025
            "dd.MM.yyyy", // 07.01.2025
            "yyyy.MM.dd", // 2025.01.07
            "MM/dd/yyyy", // 01/07/2025
            "dd/MM/yyyy", // 07/01/2025
          ];

          for (const dateFormat of possibleFormats) {
            const parsedDate = parse(
              rawDate.toString(),
              dateFormat,
              new Date()
            );
            if (isValid(parsedDate)) {
              deliveryDate = format(parsedDate, "yyyy-MM-dd");
              break;
            }
          }

          // If no format matched, try parsing as Excel date number
          if (!deliveryDate && typeof rawDate === "number") {
            const excelDate = new Date((rawDate - 25569) * 86400 * 1000);
            if (isValid(excelDate)) {
              deliveryDate = format(excelDate, "yyyy-MM-dd");
            }
          }
        }

        if (!deliveryDate) {
          console.error("Failed to parse date:", rawDate);
          deliveryDate = new Date().toISOString().split("T")[0]; // Fallback to current date
        }

        const processedRow = {
          complaint_number: row["Numer reklamacji"] || 0,
          client: row["Klient Maczfit / Dietly"] || "",
          description: row["Opis problemu"] || "",
          problem_type: row["Rodzaj problemu"] || "",
          compensation_value: normalizedValue,
          courier: row["Kurier"] || "",
          address: row["Adres"] || "",
          delivery_date: deliveryDate,
          comments: null,
        };

        console.log("Processed row:", processedRow);
        return processedRow;
      });

      return {
        file,
        data: processedData,
      };
    } catch (error) {
      console.error("Error processing file:", error);
      return {
        file,
        data: [],
        error: "Failed to process file. Please ensure it's a valid Excel file.",
      };
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const processedFiles = await Promise.all(
      acceptedFiles.map(processExcelFile)
    );
    setFiles((prev) => [...prev, ...processedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const allComplaints = files.flatMap((file) => file.data);
      if (allComplaints.length === 0) {
        setError("No valid complaints to submit");
        return;
      }

      const result = await createComplaints(allComplaints);
      setSuccess(
        `Successfully processed ${result.totalCreated} complaints. ${result.totalSkipped} were skipped.`
      );
      setFiles([]);
    } catch (error) {
      setError("Failed to submit complaints. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50/10 text-success-500 p-3 rounded-lg text-sm border border-success-500/20">
          {success}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary-500 bg-primary-500/10"
            : "border-neutral-700 hover:border-primary-500"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
        <p className="text-neutral-400">
          {isDragActive
            ? "Upuść pliki tutaj..."
            : "Przeciągnij i upuść pliki Excel lub kliknij, aby wybrać"}
        </p>
        <p className="text-sm text-neutral-500 mt-2">
          Akceptowane formaty: .xlsx, .xls
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="bg-bg-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold">
                Przesłane pliki ({files.length})
              </h3>
            </div>
            <div className="border-t border-bg-700">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-b border-bg-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-neutral-200">{file.file.name}</span>
                    {file.error && (
                      <span className="text-error-500 text-sm">
                        {file.error}
                      </span>
                    )}
                    <span className="text-neutral-400 text-sm">
                      ({file.data.length} reklamacji)
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => removeFile(index)}
                    className="text-error-500 hover:text-error-400"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || files.every((f) => f.error)}
            >
              {isSubmitting ? "Przetwarzanie..." : "Prześlij reklamacje"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
