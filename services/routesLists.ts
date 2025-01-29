import { RoutesList } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRoutesLists = async (): Promise<RoutesList[]> => {
  const response = await fetch(`${API_BASE_URL}/routes-lists`);
  return response.json();
};
