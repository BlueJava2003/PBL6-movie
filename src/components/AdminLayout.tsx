"use client";

import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="w-8"></div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">{children}</main>
      </div>
    </div>
  );
}
