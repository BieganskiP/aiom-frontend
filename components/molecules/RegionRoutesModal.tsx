"use client";

import { useState, useEffect, useRef } from "react";
import { Route, Region } from "@/types";
import { X, Trash2, AlertCircle } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Button } from "@/components/atoms/Button";
import { TableWrapper } from "@/components/atoms/TableWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutes } from "@/services/routes";
import {
  getRegionRoutes,
  addRoutesToRegion,
  removeRouteFromRegion,
} from "@/services/regions";

interface RegionRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  region: Region;
}

interface RouteWithRegion extends Route {
  regionName?: string;
}

export const RegionRoutesModal = ({
  isOpen,
  onClose,
  onUpdate,
  region,
}: RegionRoutesModalProps) => {
  const { user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [regionRoutes, setRegionRoutes] = useState<Route[]>([]);
  const [availableRoutes, setAvailableRoutes] = useState<RouteWithRegion[]>([]);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const canManageRoutes = user?.role === "admin" || user?.role === "owner";

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const [allRoutes, currentRegionRoutes] = await Promise.all([
        getRoutes(),
        getRegionRoutes(region.id),
      ]);

      setRegionRoutes(currentRegionRoutes);

      // Filter out routes that are already in this region
      const regionRouteIds = new Set(
        currentRegionRoutes.map((route) => route.id)
      );

      // Add region information to routes
      const routesWithRegions = allRoutes.map((route) => ({
        ...route,
        regionName: route.region?.name,
      }));

      // Filter out routes that are in this region
      setAvailableRoutes(
        routesWithRegions.filter((route) => !regionRouteIds.has(route.id))
      );
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setError("Nie udało się pobrać tras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRoutes();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, region.id]);

  const handleAddRoutes = async () => {
    if (selectedRoutes.length === 0) return;

    try {
      setError("");
      await addRoutesToRegion(region.id, selectedRoutes);
      setSelectedRoutes([]);
      fetchRoutes();
      onUpdate();
    } catch (error) {
      setError("Nie udało się dodać tras do regionu");
      console.error(error);
    }
  };

  const handleRemoveRoute = async (routeId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę trasę z regionu?"))
      return;

    try {
      setError("");
      await removeRouteFromRegion(region.id, routeId);
      fetchRoutes();
      onUpdate();
    } catch (error) {
      setError("Nie udało się usunąć trasy z regionu");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="h-12 w-48 bg-bg-700 rounded animate-pulse mb-6" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-bg-800 rounded-lg p-4 md:p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4">
          Zarządzaj trasami - {region.name}
        </h2>

        {error && (
          <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Current routes in the region */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Trasy w regionie</h3>
            <TableWrapper>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bg-700">
                    <th className="text-left p-4 text-neutral-400 font-medium">
                      Nazwa
                    </th>
                    <th className="text-left p-4 text-neutral-400 font-medium">
                      Przypisany użytkownik
                    </th>
                    <th className="w-10 p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-700">
                  {regionRoutes.map((route) => (
                    <tr key={route.id} className="group">
                      <td className="p-4 text-foreground">{route.name}</td>
                      <td className="p-4 text-foreground">
                        {route.assignedUser
                          ? `${route.assignedUser.firstName} ${route.assignedUser.lastName}`
                          : "-"}
                      </td>
                      <td className="p-4">
                        {canManageRoutes && (
                          <button
                            onClick={() => handleRemoveRoute(route.id)}
                            className="text-error-500 hover:text-error-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {regionRoutes.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-4 text-center text-neutral-400"
                      >
                        Brak tras w tym regionie
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TableWrapper>
          </div>

          {/* Add routes section */}
          {canManageRoutes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Dodaj trasy</h3>
              <div className="space-y-4">
                <TableWrapper>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-bg-700">
                        <th className="w-10 p-4"></th>
                        <th className="text-left p-4 text-neutral-400 font-medium">
                          Nazwa
                        </th>
                        <th className="text-left p-4 text-neutral-400 font-medium">
                          Przypisany użytkownik
                        </th>
                        <th className="text-left p-4 text-neutral-400 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bg-700">
                      {availableRoutes.map((route) => (
                        <tr key={route.id} className="group">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedRoutes.includes(route.id)}
                              disabled={route.regionName !== undefined}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRoutes([
                                    ...selectedRoutes,
                                    route.id,
                                  ]);
                                } else {
                                  setSelectedRoutes(
                                    selectedRoutes.filter(
                                      (id) => id !== route.id
                                    )
                                  );
                                }
                              }}
                              className="rounded border-bg-700 bg-bg-700 text-primary-500 focus:ring-primary-500 disabled:opacity-50"
                            />
                          </td>
                          <td className="p-4 text-foreground">{route.name}</td>
                          <td className="p-4 text-foreground">
                            {route.assignedUser
                              ? `${route.assignedUser.firstName} ${route.assignedUser.lastName}`
                              : "-"}
                          </td>
                          <td className="p-4 text-foreground">
                            {route.regionName ? (
                              <div className="flex items-center gap-2 text-yellow-500">
                                <AlertCircle size={16} />
                                <span>
                                  Przypisana do regionu: {route.regionName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-green-500">Dostępna</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {availableRoutes.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-neutral-400"
                          >
                            Brak dostępnych tras do dodania
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </TableWrapper>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAddRoutes}
                    disabled={selectedRoutes.length === 0}
                  >
                    Dodaj wybrane trasy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
