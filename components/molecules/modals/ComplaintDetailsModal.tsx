"use client";

import { useRef } from "react";
import { Complaint, ComplaintStatus } from "@/types";
import { Button } from "@/components/atoms/buttons/Button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useClickOutside } from "@/hooks/useClickOutside";

interface ComplaintDetailsModalProps {
  complaint: Complaint;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplaintDetailsModal({
  complaint,
  isOpen,
  onClose,
}: ComplaintDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-bg-800 rounded-lg p-6 w-full max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">
          Reklamacja #{complaint.complaint_number}
        </h2>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400">Klient</label>
              <p className="font-medium">{complaint.client}</p>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Kurier</label>
              <p className="font-medium">{complaint.courier}</p>
            </div>
          </div>

          {/* Address and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400">Adres</label>
              <p className="font-medium">{complaint.address}</p>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Data dostawy</label>
              <p className="font-medium">
                {format(new Date(complaint.delivery_date), "d MMMM yyyy", {
                  locale: pl,
                })}
              </p>
            </div>
          </div>

          {/* Problem Details */}
          <div>
            <label className="text-sm text-neutral-400">Rodzaj problemu</label>
            <p className="font-medium">{complaint.problem_type}</p>
          </div>

          <div>
            <label className="text-sm text-neutral-400">Opis</label>
            <p className="font-medium whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Compensation and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400">
                Wartość rekompensaty
              </label>
              <p className="font-medium">
                {complaint.compensation_value
                  ? `${complaint.compensation_value} zł`
                  : "Brak"}
              </p>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Status</label>
              <p className="font-medium">
                {complaint.status === ComplaintStatus.EMPTY && "Nowa"}
                {complaint.status === ComplaintStatus.IN_PROGRESS &&
                  "W trakcie"}
                {complaint.status === ComplaintStatus.APPROVED &&
                  "Zaakceptowana"}
                {complaint.status === ComplaintStatus.REJECTED && "Odrzucona"}
              </p>
            </div>
          </div>

          {/* Assigned User */}
          <div>
            <label className="text-sm text-neutral-400">Przypisany do</label>
            <p className="font-medium">
              {complaint.user
                ? `${complaint.user.firstName} ${complaint.user.lastName}`
                : "Nieprzypisana"}
            </p>
          </div>

          {/* Comments */}
          {complaint.comments && (
            <div>
              <label className="text-sm text-neutral-400">Komentarze</label>
              <p className="font-medium whitespace-pre-wrap">
                {complaint.comments}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Zamknij
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
