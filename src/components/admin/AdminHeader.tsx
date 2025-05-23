import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AdminHeaderProps {
  onViewWebsite: () => void;
  onLogout: () => void;
}

const AdminHeader = ({ onViewWebsite, onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>
        <div className="flex gap-4">
          <Button onClick={onViewWebsite}>View Website</Button>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
