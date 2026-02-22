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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSessionId, setRoomOrTable } = useOrderSessionContext();

  useEffect(() => {
    if (otpParam) setOtp(otpParam.slice(0, 6));
  }, [otpParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
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
