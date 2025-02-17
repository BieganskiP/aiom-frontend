"use client";

import { RoutesList } from "@/types";
import { format } from "date-fns";

interface RouteListsTableProps {
  routesLists: RoutesList[];
  loading?: boolean;
}

export default function RouteListsTable({
  routesLists,
  loading,
}: RouteListsTableProps) {
  return (
    <div className="bg-bg-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bg-700">
              <th className="text-left p-4 text-sm font-medium text-neutral-400">
                Trasa
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400">
                Liczba przystanków
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400">
                Liczba paczek
              </th>
              <th className="text-left p-4 text-sm font-medium text-neutral-400">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-neutral-400">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                  </div>
                </td>
              </tr>
            ) : routesLists.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-neutral-400">
                  Brak list tras
                </td>
              </tr>
            ) : (
              routesLists.map((routesList) => (
                <tr key={routesList.id} className="group">
                  <td className="p-4 text-foreground">{routesList.route}</td>
                  <td className="p-4 text-foreground">
                    {routesList.number_of_stops}
                  </td>
                  <td className="p-4 text-foreground">
                    {routesList.number_of_packages}
                  </td>
                  <td className="p-4 text-foreground">
                    {format(routesList.date, "dd.MM.yyyy")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
