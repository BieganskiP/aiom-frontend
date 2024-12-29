"use client";

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Car,
  Route,
  ClipboardList,
} from "lucide-react";
import { Nav, NavItem } from "./Nav";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "@/components/atoms/LogoutButton";

export const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="w-64 h-screen border-r border-bg-700 p-4 flex flex-col bg-bg-800">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">AIOM</h1>
      </div>

      {/* Main navigation - grows to fill available space */}
      <div className="flex-grow">
        <Nav>
          <NavItem href="/dashboard">
            <LayoutDashboard size={20} />
            Panel główny
          </NavItem>

          {isAdmin && (
            <NavItem href="/dashboard/users">
              <Users size={20} />
              Użytkownicy
            </NavItem>
          )}

          {isAdmin && (
            <NavItem href="/dashboard/cars">
              <Car size={20} />
              Samochody
            </NavItem>
          )}

          {isAdmin && (
            <NavItem href="/dashboard/routes">
              <Route size={20} />
              Trasy
            </NavItem>
          )}

          <NavItem href="/dashboard/work-entries">
            <ClipboardList size={20} />
            Wpisy pracy
          </NavItem>

          {isAdmin && (
            <NavItem href="/dashboard/work-entries/all">
              <ClipboardList size={20} />
              Wszystkie wpisy
            </NavItem>
          )}

          <NavItem href="/dashboard/documents">
            <FileText size={20} />
            Dokumenty
          </NavItem>

          <NavItem href="/dashboard/settings">
            <Settings size={20} />
            Ustawienia
          </NavItem>
        </Nav>
      </div>

      {/* Bottom section with logout button */}
      <div className="mt-auto pt-4 border-t border-bg-700">
        <LogoutButton className="w-full justify-center">
          <div className="flex items-center gap-2">
            <LogOut size={20} />
            Wyloguj się
          </div>
        </LogoutButton>
      </div>
    </aside>
  );
};
