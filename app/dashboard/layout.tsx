import { Sidebar } from "@/components/molecules/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64 min-w-0">
        <div className="p-4 md:p-6 mt-16 md:mt-0">{children}</div>
      </div>
    </div>
  );
}
