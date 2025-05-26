
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useUserLogging } from "@/hooks/useUserLogging";

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
const Gallery = lazy(() => import("./pages/Gallery"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
      retry: 1, // Only retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
});

// Enhanced loading component with hotel-themed animation
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hotel-light via-white to-hotel-light">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-8">
        {/* Animated mountain backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark to-hotel-gold rounded-full animate-pulse opacity-20"></div>
        
        {/* Main hotel building */}
        <div className="absolute inset-4 border-4 border-hotel-gold rounded-lg animate-[glow_2s_ease-in-out_infinite] bg-white shadow-lg">
          {/* Animated windows */}
          <div className="absolute top-3 left-3 w-3 h-3 bg-hotel-gold rounded-sm animate-[glow_1.5s_ease-in-out_infinite] opacity-80"></div>
          <div className="absolute top-3 right-3 w-3 h-3 bg-hotel-gold rounded-sm animate-[glow_1.5s_ease-in-out_infinite_0.3s] opacity-80"></div>
          <div className="absolute top-8 left-3 w-3 h-3 bg-hotel-gold rounded-sm animate-[glow_1.5s_ease-in-out_infinite_0.6s] opacity-80"></div>
          <div className="absolute top-8 right-3 w-3 h-3 bg-hotel-gold rounded-sm animate-[glow_1.5s_ease-in-out_infinite_0.9s] opacity-80"></div>
          
          {/* Entrance door */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-6 border-2 border-hotel-gold rounded-t-lg bg-hotel-dark"></div>
          
          {/* Hotel sign */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-hotel-gold rounded animate-pulse"></div>
        </div>
        
        {/* Floating elements around hotel */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-hotel-gold rounded-full animate-bounce opacity-60"></div>
        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-hotel-gold rounded-full animate-[bounce_1.5s_ease-in-out_infinite_0.5s] opacity-60"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-hotel-gold rounded-full animate-[bounce_2s_ease-in-out_infinite_1s] opacity-60"></div>
      </div>
      
      {/* Animated welcome text */}
      <div className="text-2xl font-bold text-hotel-dark mb-2">
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite]">W</span>
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite_0.1s]">e</span>
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite_0.2s]">l</span>
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite_0.3s]">c</span>
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite_0.4s]">o</span>
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite_0.5s]">m</span>
        <span className="inline-block animate-[bounce_1s_ease-in-out_infinite_0.6s]">e</span>
      </div>
      <div className="text-hotel-accent animate-pulse">to Hotel Vedic Alaknanda</div>
      
      {/* Loading dots */}
      <div className="flex justify-center space-x-1 mt-4">
        <div className="w-2 h-2 bg-hotel-gold rounded-full animate-[bounce_1.4s_ease-in-out_infinite]"></div>
        <div className="w-2 h-2 bg-hotel-gold rounded-full animate-[bounce_1.4s_ease-in-out_infinite_0.2s]"></div>
        <div className="w-2 h-2 bg-hotel-gold rounded-full animate-[bounce_1.4s_ease-in-out_infinite_0.4s]"></div>
      </div>
    </div>
  </div>
);

// ScrollToTop component that handles the scrolling behavior
function ScrollToTop() {
  const location = useLocation();
  const { logUserVisit } = useUserLogging();

  useEffect(() => {
    window.scrollTo(0, 0);
    // logUserVisit();
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
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
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
