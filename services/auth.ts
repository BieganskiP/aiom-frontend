import Cookies from "js-cookie";
import { User, LoginResponse, SignupData, TokenResponse } from "@/types";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:3001/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Login failed with status ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to connect to the server");
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/v1/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } finally {
    // Clear local storage and cookies regardless of API response
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token", { path: "/" });
  }
};

export const signup = async (data: SignupData): Promise<void> => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/v1/auth/complete-registration",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Rejestracja nie powiodła się (${response.status})`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Nie udało się połączyć z serwerem");
  }
};

export const refreshUserSession = async (): Promise<TokenResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh session");
    }

    const data = await response.json();

    // Update stored data
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    Cookies.set("token", data.access_token, { expires: 1, path: "/" });

    return data;
  } catch (error) {
    // If refresh fails, log out the user
    await logout();
    throw error;
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/v1/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  } catch (error) {
    await logout();
    throw error;
  }
};
