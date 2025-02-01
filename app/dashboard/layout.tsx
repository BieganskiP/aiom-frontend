import { Sidebar } from "@/components/molecules/navigation/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 md:p-6 mt-16 md:mt-0">{children}</div>
      </div>
    </div>
  );
}
