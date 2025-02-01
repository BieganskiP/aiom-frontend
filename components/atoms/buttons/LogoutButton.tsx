"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { logout } from "@/services/auth";

interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const LogoutButton = ({
  children,
  className,
  ...props
}: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Błąd wylogowania:", error);
      router.push("/");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className={className}
      {...props}
    >
      {children || "Wyloguj się"}
    </Button>
  );
};
