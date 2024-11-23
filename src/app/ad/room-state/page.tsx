import RoomScheduleSelector from "@/components/ad/room-state/RoomScheduleSelector";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";
import React from "react";

export default function page() {
  return (
    <SidebarProvider>
      <AdminLayout>
        <RoomScheduleSelector />
      </AdminLayout>
    </SidebarProvider>
  );
}
