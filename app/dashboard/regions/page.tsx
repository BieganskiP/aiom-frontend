"use client";

import { useEffect, useState } from "react";
import { Region } from "@/types";
import { getRegions, getMyRegions } from "@/services/regions";
import { Button } from "@/components/atoms/buttons/Button";
import { RegionsList } from "@/components/molecules/tables/RegionsList";
import { RegionEditModal } from "@/components/molecules/modals/RegionEditModal";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/atoms/layout/PageHeader";

export default function RegionsPage() {
  const { user } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const canManageRegions = user?.role === "admin" || user?.role === "owner";

  const fetchRegions = async () => {
    try {
      setError("");
      setLoading(true);
      const data =
        user?.role === "leader" ? await getMyRegions() : await getRegions();
      setRegions(data);
    } catch (error) {
      setError("Nie udało się pobrać listy regionów");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Regiony" />
        {canManageRegions && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Dodaj region</span>
            <span className="sm:hidden">Dodaj</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-6">
          {error}
        </div>
      )}

      <RegionsList
        regions={regions}
        onUpdate={fetchRegions}
        onEdit={setEditingRegion}
        loading={loading}
      />

      <RegionEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchRegions}
      />

      {editingRegion && (
        <RegionEditModal
          isOpen={true}
          onClose={() => setEditingRegion(null)}
          onSuccess={fetchRegions}
          region={editingRegion}
        />
      )}
    </div>
  );
}
