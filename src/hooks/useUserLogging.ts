import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface UserLogData {
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  path?: string;
  referrer?: string;
}

export const useUserLogging = () => {
  const location = useLocation();
  const loggedRef = useRef(false);

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    // Detect device type
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile';
    }

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'MacOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { deviceType, browser, os, userAgent };
  };

  const logUserVisit = async () => {
    if (loggedRef.current) return;
    loggedRef.current = true;

    try {
      const { deviceType, browser, os, userAgent } = getDeviceInfo();
      
      const logData: UserLogData = {
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        path: location.pathname,
        referrer: document.referrer || null,
      };

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const locationData = await response.json();
          logData.ip_address = locationData.ip;
          logData.country = locationData.country_name;
          logData.city = locationData.city;
        }
      } catch (error) {
        console.log('Could not fetch location data:', error);
      }

      const { error } = await supabase
        .from("user_logs")
        .insert([logData]);

      if (error) {
        console.error('Error logging user visit:', error);
      }
    } catch (error) {
      console.error('Error in user logging:', error);
    }
  };

  useEffect(() => {
    loggedRef.current = false;
    logUserVisit();
  }, [location.pathname]);

  return { logUserVisit };
};