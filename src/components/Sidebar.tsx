"use client";

import Link from "next/link";
import { BookOpen, Grid, Film, Home, RockingChairIcon as Chair, Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { name: "Booking", url: "/ad/booking", icon: BookOpen },
  { name: "Category", url: "/ad/category", icon: Grid },
  { name: "Movie", url: "/ad/movie", icon: Film },
  { name: "Room", url: "/ad/room", icon: Home },
  { name: "Seat", url: "/ad/seat", icon: Chair },
];

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`bg-indigo-700 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu size={24} />
        </button>
      </div>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.url}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white"
          >
            <div className="flex items-center space-x-2">
              <item.icon size={20} />
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
