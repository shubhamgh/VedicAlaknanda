import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleViewWebsite = () => {
    navigate("/");
  };

  const handleLogout = () => {
    navigate("/admin-login");
  };

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false });

        if (error) throw error;

        setSubscribers(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching subscribers",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubscribers();
    }
  }, [isAuthenticated]);

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const csvContent = [
      ["Email", "Subscribed At"],
      ...filteredSubscribers.map((sub) => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Access denied. Please log in as admin.</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-4 pt-8 pb-16">
        <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3">
            <Input
              type="search"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={exportToCSV}>Export to CSV</Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading subscribers...</div>
        ) : (
          <>
            <p className="mb-4">Total subscribers: {subscribers.length}</p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>
                        {format(new Date(subscriber.subscribed_at), "PPp")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterSubscribers;
