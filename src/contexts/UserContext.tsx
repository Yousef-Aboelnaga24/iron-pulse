import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/api/axios";

export type UserRole = "admin" | "member" | "trainer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_subscribed?: boolean;
}

interface SubscribeData {
  plan_id: number;
  member_id: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  profilePhoto?: string;
  idPhoto?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  subscribe: (
    data: SubscribeData,
  ) => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const TOKEN_KEY = "ironpulse_token";
const USER_KEY = "ironpulse_user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 🔁 Auto login from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      setIsSubscribed(parsedUser.is_subscribed || false);
    }

    setLoading(false);
  }, []);

  // 🌐 Axios default header
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/login", { email, password });
      const { token, user } = res.data;

      setToken(token);
      setUser(user);
      setIsSubscribed(user.is_subscribed || false);

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsSubscribed(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common["Authorization"];
  };

  // Subscribe function
  const subscribe = async (data: SubscribeData) => {
    try {
      const res = await api.post("/memberships", data);
      setIsSubscribed(true);
      setUser((prev) => {
        const updated = prev ? { ...prev, is_subscribed: true } : null;
        if (updated) localStorage.setItem(USER_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, error: message };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        isSubscribed,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        subscribe,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
