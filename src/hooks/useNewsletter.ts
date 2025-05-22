
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  
  const subscribeToNewsletter = async (email: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }])
        .select();
        
      if (error) {
        if (error.code === '23505') {
          // Unique violation - email already exists
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Subscription successful",
          description: "Thank you for subscribing to our newsletter!",
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Error subscribing",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };
  
  return {
    loading,
    subscribeToNewsletter
  };
};
