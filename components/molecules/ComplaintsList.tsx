"use client";

import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { Complaint, ComplaintStatus, User } from "@/types";
import {
  getComplaints,
  ComplaintsQueryParams,
  bulkAssignComplaints,
  bulkUpdateComplaintStatus,
} from "@/services/complaints";
import { getUsers } from "@/services/users";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { Search, ArrowUpDown, Users } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ComplaintDetailsModal } from "./ComplaintDetailsModal";

interface ComplaintsListProps {
  userId?: string;
  selectedMonth?: string;
}

interface Filters {
  searchAddress: string;
  client: string;
  userId?: string;
  courier: string;
  startDate: string;
  endDate: string;
  month: string;
  problem_type: string;
  status: ComplaintStatus | "";
}

interface SortConfig {
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

type QueryParams = Omit<ComplaintsQueryParams, "status"> & {
  status?: ComplaintStatus | "";
};

export default function ComplaintsList({
  userId,
  selectedMonth,
}: ComplaintsListProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    searchAddress: "",
    client: "",
    userId: userId,
    courier: "",
    startDate: "",
    endDate: "",
    month: selectedMonth || "",
    problem_type: "",
    status: "",
  });

  // Sorting state
  const [sort, setSort] = useState<SortConfig>({
    sortBy: "delivery_date",
    sortOrder: "ASC",
  });

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Prepare query parameters
      const queryParams: QueryParams = {
        page,
        limit,
        ...filters,
        ...sort,
      };

      // If month is selected, convert it to month number (1-12)
      if (queryParams.month) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_year, month] = queryParams.month.split("-");
        queryParams.month = month;
      }

      // Remove empty filters
      const cleanedParams: ComplaintsQueryParams = Object.fromEntries(
        Object.entries(queryParams).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_key, value]) => value !== "" && value !== undefined
        )
      ) as ComplaintsQueryParams;

      const response = await getComplaints(cleanedParams);
      setComplaints(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      setError("Nie udało się pobrać reklamacji");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters, sort]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, [fetchComplaints, fetchUsers]);

  useEffect(() => {
    if (selectedMonth) {
      handleFilterChange("month", selectedMonth);
    }
  }, [selectedMonth]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset page when filters change
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof Filters
  ) => {
    handleFilterChange(key, e.target.value);
  };

  const handleSort = (field: string) => {
    setSort((prev) => ({
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "DESC" ? "ASC" : "DESC",
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchAddress: "",
      client: "",
      userId: userId, // Keep the userId if it was provided
      courier: "",
      startDate: "",
      endDate: "",
      month: selectedMonth || "",
      problem_type: "",
      status: "",
    });
    setPage(1);
  };

  // Handle bulk selection
  const handleSelectComplaint = (complaintId: string) => {
    setSelectedComplaints((prev) => {
      const isSelected = prev.includes(complaintId);
      if (isSelected) {
        return prev.filter((id) => id !== complaintId);
      } else {
        return [...prev, complaintId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedComplaints.length === complaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(complaints.map((c) => c.id));
    }
  };

  // Bulk actions
  const handleBulkAssign = async (newUserId: string) => {
    if (selectedComplaints.length === 0) return;

    try {
      setBulkActionLoading(true);
      await bulkAssignComplaints(
        selectedComplaints.map((id) => parseInt(id)),
        newUserId
      );
      await fetchComplaints(); // Refresh the list
      setSelectedComplaints([]);
    } catch (error) {
      setError("Nie udało się przypisać reklamacji");
      console.error(error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: ComplaintStatus) => {
    if (selectedComplaints.length === 0) return;

    try {
      setBulkActionLoading(true);
      await bulkUpdateComplaintStatus(
        selectedComplaints.map((id) => parseInt(id)),
        newStatus
      );
      await fetchComplaints(); // Refresh the list
      setSelectedComplaints([]);
    } catch (error) {
      setError("Nie udało się zaktualizować statusu");
      console.error(error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const problemTypes = [
    "Brak dostawy",
    "Jakość dostawy",
    "Opóźnienie",
    "Zachowanie kuriera",
    "Inne",
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filtry</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="text-neutral-400 hover:text-neutral-200"
          >
            Resetuj filtry
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">
              Wyszukaj po adresie
            </label>
            <div className="relative">
              <Input
                type="text"
                value={filters.searchAddress}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "searchAddress")
                }
                placeholder="Wpisz adres..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Klient</label>
            <Select
              value={filters.client}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(e, "client")
              }
            >
              <option value="">Wszyscy</option>
              <option value="Maczfit">Maczfit</option>
              <option value="Dietly">Dietly</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Kurier</label>
            <Input
              type="text"
              value={filters.courier}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "courier")
              }
              placeholder="Nazwa kuriera..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Rodzaj problemu</label>
            <Select
              value={filters.problem_type}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(e, "problem_type")
              }
            >
              <option value="">Wszystkie</option>
              {problemTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Status</label>
            <Select
              value={filters.status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(e, "status")
              }
            >
              <option value="">Wszystkie</option>
              <option value={ComplaintStatus.EMPTY}>Nowa</option>
              <option value={ComplaintStatus.IN_PROGRESS}>W trakcie</option>
              <option value={ComplaintStatus.APPROVED}>Zaakceptowana</option>
              <option value={ComplaintStatus.REJECTED}>Odrzucona</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Data od</label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "startDate")
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Data do</label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "endDate")
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Miesiąc</label>
            <Input
              type="month"
              value={filters.month}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "month")
              }
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {!userId && selectedComplaints.length > 0 && (
        <div className="bg-bg-800 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Wybrano {selectedComplaints.length} reklamacji
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedComplaints([])}
            >
              Wyczyść zaznaczenie
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              className="max-w-xs"
              onChange={(e) => handleBulkAssign(e.target.value)}
              disabled={bulkActionLoading}
            >
              <option value="">Przypisz do użytkownika...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Select>
            <Select
              className="max-w-xs"
              onChange={(e) =>
                handleBulkStatusUpdate(e.target.value as ComplaintStatus)
              }
              disabled={bulkActionLoading}
            >
              <option value="">Zmień status...</option>
              <option value={ComplaintStatus.EMPTY}>Nowa</option>
              <option value={ComplaintStatus.IN_PROGRESS}>W trakcie</option>
              <option value={ComplaintStatus.APPROVED}>Zaakceptowana</option>
              <option value={ComplaintStatus.REJECTED}>Odrzucona</option>
            </Select>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-error-50/10 text-error-500 p-3 rounded-lg text-sm border border-error-500/20">
          {error}
        </div>
      )}

      {/* Complaints table */}
      <div className="bg-bg-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-700">
                {!userId && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        complaints.length > 0 &&
                        selectedComplaints.length === complaints.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-bg-600"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSort("complaint_number")}
                      className="flex items-center space-x-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                    >
                      <span>Numer</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("client")}
                    className="flex items-center space-x-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                  >
                    <span>Klient</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-neutral-400">
                    Problem
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("delivery_date")}
                    className="flex items-center space-x-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                  >
                    <span>Data dostawy</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-neutral-400">
                    Status
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("userId")}
                    className="flex items-center space-x-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                  >
                    <span>Przypisany do</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-neutral-400">
                    Akcje
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={userId ? 9 : 10}
                    className="px-4 py-8 text-center text-neutral-400"
                  >
                    Ładowanie...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan={userId ? 9 : 10}
                    className="px-4 py-8 text-center text-neutral-400"
                  >
                    Brak reklamacji spełniających kryteria
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b border-bg-700 last:border-b-0"
                  >
                    {!userId && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedComplaints.includes(complaint.id)}
                          onChange={() => handleSelectComplaint(complaint.id)}
                          className="rounded border-bg-600"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">{complaint.complaint_number}</td>
                    <td className="px-4 py-3">{complaint.client}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-md">
                        <div className="font-medium">
                          {complaint.problem_type}
                        </div>
                        <div className="text-sm text-neutral-400 truncate">
                          {complaint.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {format(
                        new Date(complaint.delivery_date),
                        "d MMMM yyyy",
                        {
                          locale: pl,
                        }
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ComplaintStatusBadge status={complaint.status} />
                    </td>
                    <td className="px-4 py-3">
                      {complaint.user ? (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-neutral-400" />
                          <span>
                            {complaint.user.firstName} {complaint.user.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400">Nieprzypisana</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        Szczegóły
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            Pokazuje {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
            z {total} reklamacji
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Poprzednia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Następna
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  type StatusConfig = {
    [K in ComplaintStatus]: { label: string; className: string };
  };

  const statusConfig: StatusConfig = {
    [ComplaintStatus.EMPTY]: {
      label: "Nowa",
      className: "bg-primary-500/10 text-primary-500",
    },
    [ComplaintStatus.IN_PROGRESS]: {
      label: "W trakcie",
      className: "bg-warning-500/10 text-warning-500",
    },
    [ComplaintStatus.APPROVED]: {
      label: "Zaakceptowana",
      className: "bg-success-500/10 text-success-500",
    },
    [ComplaintStatus.REJECTED]: {
      label: "Odrzucona",
      className: "bg-error-500/10 text-error-500",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
