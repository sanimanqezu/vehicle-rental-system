import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar />
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
