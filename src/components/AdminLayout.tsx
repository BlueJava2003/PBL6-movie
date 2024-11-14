"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Grid, Film, Home, RockingChairIcon as Chair, Menu } from "lucide-react";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: "Booking", url: "/ad/booking", icon: BookOpen },
    { name: "Category", url: "/ad/category", icon: Grid },
    { name: "Movie", url: "/ad/movie", icon: Film },
    { name: "Room", url: "/ad/room", icon: Home },
    { name: "Seat", url: "/ad/seat", icon: Chair },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-indigo-700 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-semibold">Welcome to Admin Dashboard</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <item.icon size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                </div>
                <p className="mt-4 text-gray-600">Manage {item.name.toLowerCase()} details and settings.</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
