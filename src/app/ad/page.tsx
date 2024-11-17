"use client";

import { SidebarProvider } from "@/components/SidebarContext";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "@/components/AdminDashboard";

export default function Layout() {
  return (
    <SidebarProvider>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </SidebarProvider>
  );
}
