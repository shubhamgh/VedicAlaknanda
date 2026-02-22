import { Link } from "react-router-dom";
import { useOrderSessionContext } from "@/contexts/OrderSessionContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderConfirm() {
  const { sessionId, roomOrTable } = useOrderSessionContext();

  if (!sessionId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-2xl font-bold">No active session</h1>
          <Link to="/order">
            <Button>Enter OTP to order</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-2xl font-bold text-hotel-dark">
          Order placed successfully
        </h1>
        {roomOrTable && (
          <p className="text-muted-foreground">For {roomOrTable}</p>
        )}
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Your order has been sent to the kitchen. A staff member will assist
          you shortly.
        </p>
        <div className="flex gap-4">
          <Link to="/order/menu">
            <Button>Order more</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Return home</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
