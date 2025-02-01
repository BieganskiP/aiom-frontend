"use client";

import { Region } from "@/types";
import { useState } from "react";
import { Pencil, Trash2, Route } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteRegion } from "@/services/regions";
import { TableWrapper } from "@/components/atoms/layout/TableWrapper";
import { DropdownMenu } from "@/components/atoms/inputs/DropdownMenu";
import { RegionRoutesModal } from "@/components/molecules/modals/RegionRoutesModal";

interface RegionsListProps {
  regions: Region[];
  onUpdate: () => void;
  onEdit: (region: Region) => void;
  loading: boolean;
}

export const RegionsList = ({
  regions,
  onUpdate,
  onEdit,
  loading,
}: RegionsListProps) => {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [managingRoutesRegion, setManagingRoutesRegion] =
    useState<Region | null>(null);
  const canManageRegions = user?.role === "admin" || user?.role === "owner";
  const canViewRoutes = canManageRegions || user?.role === "leader";

  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten region?")) return;

    try {
      setError("");
      await deleteRegion(id);
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć regionu");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      <TableWrapper>
        {loading ? (
          <div className="h-12 bg-bg-700 rounded animate-pulse" />
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-bg-700">
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Nazwa
                </th>
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Opis
                </th>
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Lider
                </th>
                <th className="text-left p-4 text-neutral-400 font-medium">
                  Liczba tras
                </th>
                <th className="w-10 p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-700">
              {regions.map((region) => (
                <tr key={region.id} className="group">
                  <td className="p-4 text-foreground">{region.name}</td>
                  <td className="p-4 text-foreground">
                    {region.description || "-"}
                  </td>
                  <td className="p-4 text-foreground">
                    {region.leader
                      ? `${region.leader.firstName} ${region.leader.lastName}`
                      : "-"}
                  </td>
                  <td className="p-4 text-foreground">
                    {region.routes?.length || 0}
                  </td>
                  <td className="p-4">
                    {(canManageRegions || canViewRoutes) && (
                      <DropdownMenu>
                        {canManageRegions && (
                          <>
                            <button
                              onClick={() => onEdit(region)}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                            >
                              <Pencil size={16} />
                              Edytuj
                            </button>
                            <button
                              onClick={() => handleDelete(region.id)}
                              className="w-full px-4 py-2 text-left text-sm text-error-500 hover:bg-error-500/10 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Usuń
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setManagingRoutesRegion(region)}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-200 hover:bg-bg-700 flex items-center gap-2"
                        >
                          <Route size={16} />
                          Zarządzaj trasami
                        </button>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableWrapper>

      {managingRoutesRegion && (
        <RegionRoutesModal
          isOpen={true}
          onClose={() => setManagingRoutesRegion(null)}
          onUpdate={onUpdate}
          region={managingRoutesRegion}
        />
      )}
    </div>
  );
};
