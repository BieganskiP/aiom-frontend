import { RoutesList } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRoutesLists = async (params?: {
  period?: "first" | "second";
  month?: string;
  year?: string;
}): Promise<RoutesList[]> => {
  const queryParams = new URLSearchParams();
  if (params?.period) queryParams.append("period", params.period);
  if (params?.month) queryParams.append("month", params.month);
  if (params?.year) queryParams.append("year", params.year);

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/routes-lists${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url);
  return response.json();
};
