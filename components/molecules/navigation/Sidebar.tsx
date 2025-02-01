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
  Menu,
  X,
  Map,
  List,
  Calendar,
} from "lucide-react";
import { Nav, NavItem } from "./Nav";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "@/components/atoms/buttons/LogoutButton";
import { useState, useEffect } from "react";

export const Sidebar = () => {
  const { user } = useAuth();
  const hasFullAdminAccess = user?.role === "admin" || user?.role === "owner";
  const hasLeaderAccess = hasFullAdminAccess || user?.role === "leader";
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-800 border-b border-bg-700 flex items-center justify-between px-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-bg-700 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-foreground">AIOM</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform fixed md:sticky md:top-0 inset-y-0 left-0 z-40 md:translate-x-0 w-64 h-screen border-r border-bg-700 flex flex-col bg-bg-800`}
      >
        {/* Logo - only show on desktop */}
        <div className="hidden md:block p-4 mb-4">
          <h1 className="text-xl font-bold text-foreground">AIOM</h1>
        </div>

        {/* Mobile header spacer */}
        <div className="h-16 md:hidden"></div>

        {/* Main navigation - grows to fill available space */}
        <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-bg-700 scrollbar-track-bg-800 hover:scrollbar-thumb-bg-600">
          <Nav>
            {/* Regular links */}
            <NavItem href="/dashboard" onClick={closeSidebar}>
              <LayoutDashboard size={20} />
              Panel główny
            </NavItem>

            <NavItem href="/dashboard/work-entries" onClick={closeSidebar}>
              <ClipboardList size={20} />
              Wpisy pracy
            </NavItem>

            <NavItem href="/dashboard/documents" onClick={closeSidebar}>
              <FileText size={20} />
              Dokumenty
            </NavItem>

            <NavItem href="/dashboard/complaints" onClick={closeSidebar}>
              <ClipboardList size={20} />
              Reklamacje
            </NavItem>

            <NavItem href="/dashboard/settings" onClick={closeSidebar}>
              <Settings size={20} />
              Ustawienia
            </NavItem>

            {/* Admin and Leader section */}
            {hasLeaderAccess && (
              <>
                <div className="my-2 border-t border-bg-700" />
                <NavItem href="/dashboard/users" onClick={closeSidebar}>
                  <Users size={20} />
                  Użytkownicy
                </NavItem>

                <NavItem href="/dashboard/routes" onClick={closeSidebar}>
                  <Route size={20} />
                  Trasy
                </NavItem>
                <NavItem href="/dashboard/events" onClick={closeSidebar}>
                  <Calendar size={20} />
                  Wydarzenia
                </NavItem>
              </>
            )}

            {/* Full Admin Only section */}
            {hasFullAdminAccess && (
              <>
                <div className="my-2 border-t border-bg-700" />
                <NavItem href="/dashboard/cars" onClick={closeSidebar}>
                  <Car size={20} />
                  Samochody
                </NavItem>
                <NavItem href="/dashboard/regions" onClick={closeSidebar}>
                  <Map size={20} />
                  Regiony
                </NavItem>{" "}
                <NavItem
                  href="/dashboard/work-entries/all"
                  onClick={closeSidebar}
                >
                  <ClipboardList size={20} />
                  Wszystkie wpisy
                </NavItem>
                <NavItem href="/dashboard/lists" onClick={closeSidebar}>
                  <List size={20} />
                  Listy
                </NavItem>
                <NavItem
                  href="/dashboard/complaints-admin"
                  onClick={closeSidebar}
                >
                  <ClipboardList size={20} />
                  Zarządzanie reklamacjami
                </NavItem>
              </>
            )}
          </Nav>
        </div>

        {/* Bottom section with logout button */}
        <div className="p-4 border-t border-bg-700">
          <LogoutButton className="w-full justify-center">
            <div className="flex items-center gap-2">
              <LogOut size={20} />
              Wyloguj się
            </div>
          </LogoutButton>
        </div>
      </aside>
    </>
  );
};
