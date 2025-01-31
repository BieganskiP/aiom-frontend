import { Complaint, ComplaintStatus } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateComplaintData {
  complaint_number: number;
  client: string;
  description: string;
  problem_type: string;
  compensation_value: number | null;
  courier: string;
  address: string;
  delivery_date: string;
  comments: string | null;
}

interface BulkCreateResponse {
  message: string;
  created: Complaint[];
  skipped: CreateComplaintData[];
  totalProcessed: number;
  totalCreated: number;
  totalSkipped: number;
}

interface BulkOperationResponse {
  success: boolean;
  message: string;
  updatedCount: number;
  totalCount: number;
}

export interface ComplaintsQueryParams {
  page?: number;
  limit?: number;
  searchAddress?: string;
  client?: string;
  userId?: string;
  courier?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  problem_type?: string;
  status?: ComplaintStatus;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ComplaintStats {
  total: number;
  byStatus: {
    [key in ComplaintStatus]: number;
  };
  totalCompensation: number;
  compensationByStatus: {
    [key in ComplaintStatus]: number;
  };
  period: {
    year?: number;
    month?: number;
  };
}

interface StatsQueryParams {
  year?: number;
  month?: number;
  status?: ComplaintStatus;
  userId?: string;
}

export const createComplaints = async (
  complaints: CreateComplaintData[]
): Promise<BulkCreateResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/complaints/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(complaints),
  });

  if (!response.ok) {
    throw new Error("Failed to create complaints");
  }

  return response.json();
};

export const getComplaints = async (
  params: ComplaintsQueryParams = {}
): Promise<PaginatedResponse<Complaint>> => {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();

  // Add all provided parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/complaints?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
};

export const getComplaint = async (id: string): Promise<Complaint> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch complaint");
  }

  return response.json();
};

export const assignComplaint = async (
  complaintId: string,
  userId: string
): Promise<Complaint> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/complaints/${complaintId}/assign/${userId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to assign complaint");
  }

  return response.json();
};

export const updateComplaintStatus = async (
  complaintId: string,
  status: ComplaintStatus
): Promise<Complaint> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/complaints/${complaintId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update complaint status");
  }

  return response.json();
};

export const deleteComplaint = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete complaint");
  }
};

export const bulkAssignComplaints = async (
  complaintIds: number[],
  userId: string
): Promise<BulkOperationResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/complaints/bulk-assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({
      complaintIds,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to bulk assign complaints");
  }

  return response.json();
};

export const bulkUpdateComplaintStatus = async (
  complaintIds: number[],
  status: ComplaintStatus
): Promise<BulkOperationResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/complaints/bulk-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({
      complaintIds,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to bulk update complaint status");
  }

  return response.json();
};

export const getComplaintsStats = async (
  params: StatsQueryParams = {}
): Promise<ComplaintStats> => {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();

  // Add all provided parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/complaints/stats?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch complaints stats");
  }

  return response.json();
};
