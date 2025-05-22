
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          navigate("/admin-login");
          return;
        }

        // For now, we'll accept any authenticated user
        // In a production app, you would check against a list of admin emails
        // or use custom claims to verify admin status

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return { isAuthenticated, isLoading, handleLogout };
};
