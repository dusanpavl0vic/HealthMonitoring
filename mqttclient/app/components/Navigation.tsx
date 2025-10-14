"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex space-x-4">
        <Link
          href="/dashboard"
          className={`px-4 py-2 rounded ${
            pathname === "/dashboard" || pathname === "/"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/prediction"
          className={`px-4 py-2 rounded ${
            pathname === "/prediction"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Predictions
        </Link>
      </div>
    </nav>
  );
}
