"use client";

import { useEffect, useState } from "react";
import { Region } from "@/types";
import { getRegions, getMyRegions } from "@/services/regions";
import { Button } from "@/components/atoms/Button";
import { RegionsList } from "@/components/molecules/RegionsList";
import { RegionEditModal } from "@/components/molecules/RegionEditModal";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-bg-700 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Regiony</h1>
        {canManageRegions && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} />
            Dodaj region
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <RegionsList
        regions={regions}
        onUpdate={fetchRegions}
        onEdit={setEditingRegion}
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
