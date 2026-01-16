import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
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
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; role: UserRole; error?: string };
  register: (email: string, password: string, name: string) => { success: boolean; error?: string };
  logout: () => void;
  subscribe: (subscriptionData: Omit<Subscription, "id" | "status">) => void;
  updateProfile: (updates: { name?: string; avatar?: string }) => void;
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

  // Hardcoded admin account for demo purposes
  // TODO: Backend integration - validate credentials via API with proper role checking
  const ADMIN_CREDENTIALS = {
    email: "admin@ironpulse.com",
    password: "admin123",
    name: "Admin User",
  };

  const login = (email: string, password: string): { success: boolean; role: UserRole; error?: string } => {
    // Check for admin login first
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: "admin_1",
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: "admin",
      };
      setUser(adminUser);
      return { success: true, role: "admin" };
    }

    // Regular user login - only validate email + password
    const existingUsers = JSON.parse(localStorage.getItem("ironpulse_users") || "[]");
    const foundUser = existingUsers.find((u: any) => u.email === email);
    
    // If user not found or password doesn't match - generic error (no "email exists" message)
    if (!foundUser || foundUser.password !== password) {
      return { success: false, role: "user", error: "Invalid email or password" };
    }

    // User found and password matches
    const userData: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      avatar: foundUser.avatar,
      role: "user",
    };
    setUser(userData);
    
    // Load subscription if exists
    const userSubscription = localStorage.getItem(`subscription_${foundUser.id}`);
    if (userSubscription) {
      setSubscription(JSON.parse(userSubscription));
    }
    return { success: true, role: "user" };
  };

  const register = (email: string, password: string, name: string): { success: boolean; error?: string } => {
    // TODO: Backend integration - create user via API
    const existingUsers = JSON.parse(localStorage.getItem("ironpulse_users") || "[]");
    
    // Check if email already exists - this is where "email already exists" should show
    if (existingUsers.find((u: any) => u.email === email)) {
      return { success: false, error: "This email is already registered" };
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, this would be hashed
      name,
      avatar: undefined,
      role: "user" as UserRole,
    };
    
    existingUsers.push(newUser);
    localStorage.setItem("ironpulse_users", JSON.stringify(existingUsers));
    
    // Set current user (logged in after registration)
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
    };
    setUser(userData);
    
    return { success: true };
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

  const updateProfile = (updates: { name?: string; avatar?: string }) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Also update in the users list for persistence
    if (user.role === "user") {
      const existingUsers = JSON.parse(localStorage.getItem("ironpulse_users") || "[]");
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates };
        localStorage.setItem("ironpulse_users", JSON.stringify(existingUsers));
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        subscription,
        isLoggedIn: !!user,
        isSubscribed: !!subscription && subscription.status === "active",
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        subscribe,
        updateProfile,
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
