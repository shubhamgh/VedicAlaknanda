
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleViewWebsite = () => {
    navigate('/');
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setMessages(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, read: !currentStatus } : msg
        )
      );

      toast({
        title: "Message updated",
        description: `Message marked as ${!currentStatus ? 'read' : 'unread'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Access denied. Please log in as admin.</div>;
  }

  return (
    <div>
      <AdminHeader onViewWebsite={handleViewWebsite} onLogout={handleLogout} />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3">
            <Input
              type="search"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Total messages: {messages.length} | 
            Unread: {messages.filter(m => !m.read).length}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading messages...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TableRow key={message.id} className={!message.read ? "bg-blue-50" : ""}>
                    <TableCell>
                      <Badge variant={message.read ? "secondary" : "default"}>
                        {message.read ? "Read" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {message.message}
                    </TableCell>
                    <TableCell>
                      {format(new Date(message.created_at), "PPp")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadStatus(message.id, message.read)}
                      >
                        {message.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No messages found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
