import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrderSessionByOTP } from "@/lib/restaurant-api";
import { useOrderSessionContext } from "@/contexts/OrderSessionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderOTP() {
  const [searchParams] = useSearchParams();
  const otpParam = searchParams.get("otp") ?? "";
  const [otp, setOtp] = useState(otpParam.slice(0, 6));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSessionId, setRoomOrTable, setGuestName, setGuestPhone } =
    useOrderSessionContext();

  // helper to persist guest info server-side when available
  // import lazily to avoid circular deps at top-level
  const persistGuestToServer = async (
    sessionId: string,
    name: string,
    phone: string,
  ) => {
    try {
      const { updateOrderSession } = await import("@/lib/restaurant-api");
      await updateOrderSession(sessionId, {
        guest_name: name,
        guest_phone: phone,
      });
    } catch (err) {
      // ignore - DB may not have columns; logging could be added
      // console.error("Failed to persist guest info", err);
    }
  };

  useEffect(() => {
    if (otpParam) setOtp(otpParam.slice(0, 6));
  }, [otpParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    if (!phone.trim() || !name.trim()) {
      toast({
        title: "Please provide your name and phone number",
        description:
          "We'll use this number to contact you when your order is ready.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const session = await getOrderSessionByOTP(otp.trim());
      if (!session) {
        toast({
          title: "Invalid or expired OTP",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
        return;
      }
      setSessionId(session.id);
      setGuestName(name.trim());
      setGuestPhone(phone.trim());
      // persist to server so staff/admin can see contact
      void persistGuestToServer(session.id, name.trim(), phone.trim());
      const label = session.room_number
        ? `Room ${session.room_number}`
        : session.table_number
          ? `Table ${session.table_number}`
          : null;
      setRoomOrTable(label);
      toast({ title: "Session started", description: `Ordering for ${label}` });
      navigate("/order/menu");
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to start session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Enter Order Code
            </CardTitle>
            <p className="text-center text-muted-foreground text-sm">
              Enter the 6-digit code provided by staff to start ordering.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm">Name</label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Phone number</label>
                <Input
                  placeholder="e.g. +919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this number to contact you when your order is ready.
                </p>
              </div>
              <Input
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em]"
                autoComplete="one-time-code"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Start Ordering"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <a href="/" className="text-hotel-gold hover:underline">
                Return to homepage
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
