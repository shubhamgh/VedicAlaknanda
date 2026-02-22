import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useUserLogging } from "@/hooks/useUserLogging";
import { OrderSessionProvider } from "@/contexts/OrderSessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Dining = lazy(() => import("./pages/Dining"));
const Amenities = lazy(() => import("./pages/Amenities"));
const Explore = lazy(() => import("./pages/Explore"));
const Contact = lazy(() => import("./pages/Contact"));
const BookNow = lazy(() => import("./pages/BookNow"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const Gallery = lazy(() => import("./pages/Gallery"));
const OrderOTP = lazy(() => import("./pages/OrderOTP"));
const OrderMenu = lazy(() => import("./pages/OrderMenu"));
const OrderConfirm = lazy(() => import("./pages/OrderConfirm"));
const Kitchen = lazy(() => import("./pages/Kitchen"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simplified loading component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hotel-light via-white to-hotel-light">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-hotel-gold border-t-transparent rounded-full animate-spin"></div>
      <div className="text-2xl font-bold text-hotel-dark mb-2 animate-pulse">
        Welcome
      </div>
      <div className="text-hotel-accent">to Hotel Vedic Alaknanda</div>
    </div>
  </div>
);

function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("type=invite") || hash.includes("type=recovery")) {
      navigate("/set-password");
    }
  }, [navigate]);

  return null;
}

// ScrollToTop component
function ScrollToTop() {
  const location = useLocation();
  useUserLogging();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OrderSessionProvider>
          <BrowserRouter>
            <AuthListener />
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/dining" element={<Dining />} />
                <Route path="/amenities" element={<Amenities />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/book-now" element={<BookNow />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/order" element={<OrderOTP />} />
                <Route path="/order/menu" element={<OrderMenu />} />
                <Route path="/order/confirm" element={<OrderConfirm />} />
                <Route path="/kitchen" element={<Kitchen />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </OrderSessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
