import SeatManagement from "@/components/ad/seat/AdminSeat";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";
import React from "react";

export default function SeatPage() {
  return (
    <SidebarProvider>
      <AdminLayout>
        <SeatManagement />
      </AdminLayout>
    </SidebarProvider>
  );
}
