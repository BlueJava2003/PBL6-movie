"use client";

import { SidebarProvider } from "@/components/SidebarContext";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "@/components/AdminDashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </SidebarProvider>
  );
}
