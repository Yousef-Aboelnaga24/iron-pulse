import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Subscription {
  id: string;
  planId: number;
  planName: string;
  price: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: "active" | "expired" | "cancelled";
  // User details from subscription form
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
  subscription: Subscription | null;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  subscribe: (subscriptionData: Omit<Subscription, "id" | "status">) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "ironpulse_user";
const SUBSCRIPTION_STORAGE_KEY = "ironpulse_subscription";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedSubscription = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Save subscription to localStorage
  useEffect(() => {
    if (subscription) {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
    } else {
      localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
    }
  }, [subscription]);

  const login = (email: string, password: string): boolean => {
    // TODO: Backend integration - validate credentials via API
    // Mock login - check if user exists in localStorage or create session
    const existingUsers = JSON.parse(localStorage.getItem("ironpulse_users") || "[]");
    const foundUser = existingUsers.find((u: any) => u.email === email);
    
    if (foundUser && foundUser.password === password) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar,
      };
      setUser(userData);
      
      // Load subscription if exists
      const userSubscription = localStorage.getItem(`subscription_${foundUser.id}`);
      if (userSubscription) {
        setSubscription(JSON.parse(userSubscription));
      }
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string): boolean => {
    // TODO: Backend integration - create user via API
    const existingUsers = JSON.parse(localStorage.getItem("ironpulse_users") || "[]");
    
    // Check if email already exists
    if (existingUsers.find((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, this would be hashed
      name,
      avatar: undefined,
    };
    
    existingUsers.push(newUser);
    localStorage.setItem("ironpulse_users", JSON.stringify(existingUsers));
    
    // Set current user (logged in after registration)
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    setUser(userData);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
  };

  const subscribe = (subscriptionData: Omit<Subscription, "id" | "status">) => {
    // TODO: Backend integration - create subscription via API
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: `sub_${Date.now()}`,
      status: "active",
    };
    
    setSubscription(newSubscription);
    
    // Also save to user-specific storage for persistence across logins
    if (user) {
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(newSubscription));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        subscription,
        isLoggedIn: !!user,
        isSubscribed: !!subscription && subscription.status === "active",
        login,
        register,
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
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
