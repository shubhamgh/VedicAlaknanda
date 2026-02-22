import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface OrderSessionContextValue {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  roomOrTable: string | null;
  setRoomOrTable: (v: string | null) => void;
  guestName: string | null;
  setGuestName: (v: string | null) => void;
  guestPhone: string | null;
  setGuestPhone: (v: string | null) => void;
  clearSession: () => void;
}

const OrderSessionContext = createContext<OrderSessionContextValue | null>(null);

export function OrderSessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionIdState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("restaurant_session_id");
    } catch {
      return null;
    }
  });
  const [roomOrTable, setRoomOrTableState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("restaurant_room_table");
    } catch {
      return null;
    }
  });
  const [guestName, setGuestNameState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("restaurant_guest_name");
    } catch {
      return null;
    }
  });
  const [guestPhone, setGuestPhoneState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("restaurant_guest_phone");
    } catch {
      return null;
    }
  });

  const setSessionId = useCallback((id: string | null) => {
    setSessionIdState(id);
    try {
      if (id) sessionStorage.setItem("restaurant_session_id", id);
      else sessionStorage.removeItem("restaurant_session_id");
    } catch {}
  }, []);

  const setRoomOrTable = useCallback((v: string | null) => {
    setRoomOrTableState(v);
    try {
      if (v) sessionStorage.setItem("restaurant_room_table", v);
      else sessionStorage.removeItem("restaurant_room_table");
    } catch {}
  }, []);

  const setGuestName = useCallback((v: string | null) => {
    setGuestNameState(v);
    try {
      if (v) sessionStorage.setItem("restaurant_guest_name", v);
      else sessionStorage.removeItem("restaurant_guest_name");
    } catch {}
  }, []);

  const setGuestPhone = useCallback((v: string | null) => {
    setGuestPhoneState(v);
    try {
      if (v) sessionStorage.setItem("restaurant_guest_phone", v);
      else sessionStorage.removeItem("restaurant_guest_phone");
    } catch {}
  }, []);

  const clearSession = useCallback(() => {
    setSessionIdState(null);
    setRoomOrTableState(null);
    setGuestNameState(null);
    setGuestPhoneState(null);
    try {
      sessionStorage.removeItem("restaurant_session_id");
      sessionStorage.removeItem("restaurant_room_table");
      sessionStorage.removeItem("restaurant_guest_name");
      sessionStorage.removeItem("restaurant_guest_phone");
    } catch {}
  }, []);

  return (
    <OrderSessionContext.Provider
      value={{
        sessionId,
        setSessionId,
        roomOrTable,
        setRoomOrTable,
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
        clearSession,
      }}
    >
      {children}
    </OrderSessionContext.Provider>
  );
}

export function useOrderSessionContext() {
  const ctx = useContext(OrderSessionContext);
  if (!ctx) throw new Error("useOrderSessionContext must be used within OrderSessionProvider");
  return ctx;
}
