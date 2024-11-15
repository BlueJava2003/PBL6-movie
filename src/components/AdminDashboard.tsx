"use client";

import Link from "next/link";
import { BookOpen, Grid, Film, Home, RockingChairIcon as Chair } from "lucide-react";

const navItems = [
  { name: "Booking", url: "/ad/booking", icon: BookOpen },
  { name: "Category", url: "/ad/category", icon: Grid },
  { name: "Movie", url: "/ad/movie", icon: Film },
  { name: "Room", url: "/ad/room", icon: Home },
  { name: "Seat", url: "/ad/seat", icon: Chair },
];

export default function AdminDashboard() {
  return (
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
  );
}
