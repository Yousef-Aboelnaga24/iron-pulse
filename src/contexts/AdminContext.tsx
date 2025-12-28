import { createContext, useContext, useState, ReactNode } from "react";

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
}

interface AdminContextType {
  profile: AdminProfile;
  updateProfile: (updates: Partial<AdminProfile>) => void;
}

const defaultProfile: AdminProfile = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@ironpulsegym.com",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(defaultProfile);

  const updateProfile = (updates: Partial<AdminProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AdminContext.Provider value={{ profile, updateProfile }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
