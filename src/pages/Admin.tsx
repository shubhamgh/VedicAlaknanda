
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingsTab from "@/components/admin/BookingsTab";
import AllBookingsTab from "@/components/admin/AllBookingsTab";
import InventoryTab from "@/components/admin/InventoryTab";
import MessagesTab from "@/components/admin/MessagesTab";
import LogsTab from "@/components/admin/LogsTab";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsletterSubscribers from "./NewsletterSubscribers";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, handleLogout } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        onViewWebsite={() => navigate("/")}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-4 md:grid-cols-7 text-xs sm:text-sm">
            <TabsTrigger value="bookings" className="px-2 py-1">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="all-bookings" className="px-2 py-1">
              All Bookings
            </TabsTrigger>
            <TabsTrigger value="inventory" className="px-2 py-1">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="reviews" className="px-2 py-1">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="messages" className="px-2 py-1">
              Messages
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="px-2 py-1">
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="logs" className="px-2 py-1">
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsTab />
          </TabsContent>

          <TabsContent value="all-bookings">
            <AllBookingsTab />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="logs">
            <LogsTab />
          </TabsContent>

          <TabsContent value="newsletter">
            <div className="space-y-4">
              <NewsletterSubscribers />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
