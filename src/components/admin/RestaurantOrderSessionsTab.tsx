import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createOrderSession } from "@/lib/restaurant-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function RestaurantOrderSessionsTab() {
  const [roomNumber, setRoomNumber] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [expiresIn, setExpiresIn] = useState<number>(30);
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["order-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_sessions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber && !tableNumber) {
      toast({
        title: "Error",
        description: "Enter room or table number",
        variant: "destructive",
      });
      return;
    }
    setCreating(true);
    try {
      const session = await createOrderSession({
        roomNumber: roomNumber || undefined,
        tableNumber: tableNumber || undefined,
        expiresInMinutes: expiresIn,
      });
      const url = `${window.location.origin}/order?otp=${session.otp}`;
      await navigator.clipboard.writeText(`${session.otp}\n${url}`);
      toast({
        title: "Session created",
        description: `OTP: ${session.otp} (copied to clipboard)`,
      });
      setRoomNumber("");
      setTableNumber("");
      queryClient.invalidateQueries({ queryKey: ["order-sessions"] });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const copyOTP = (otp: string) => {
    const url = `${window.location.origin}/order`;
    navigator.clipboard.writeText(`${otp}\n${url}`);
    toast({ title: "Copied", description: "OTP and link copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Order Session</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate an OTP for room or table. Guest enters OTP at /order to
            start ordering.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Room Number</Label>
              <Input
                id="room"
                placeholder="e.g. 101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table">Table Number</Label>
              <Input
                id="table"
                placeholder="e.g. 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Generate OTP"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry (minutes)</Label>
              <input
                id="expiry"
                type="number"
                min={1}
                className="w-24 px-2 py-1 border rounded-md"
                value={expiresIn}
                onChange={(e) => setExpiresIn(Number(e.target.value))}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : sessions?.length === 0 ? (
            <p className="text-muted-foreground">No active sessions</p>
          ) : (
            <div className="space-y-2">
              {sessions?.map(
                (s: {
                  id: string;
                  otp: string;
                  room_number: string | null;
                  table_number: string | null;
                  expires_at: string;
                }) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-mono font-bold">{s.otp}</span>
                      <span className="ml-2 text-muted-foreground">
                        {s.room_number
                          ? `Room ${s.room_number}`
                          : `Table ${s.table_number}`}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Expires: {new Date(s.expires_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `${window.location.origin}/order?otp=${s.otp}`,
                            "_blank",
                          )
                        }
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigate(`/admin?sessionId=${s.id}`);
                        }}
                      >
                        View Orders
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyOTP(s.otp)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
