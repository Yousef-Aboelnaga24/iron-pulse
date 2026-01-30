import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/api/axios";

export interface PlanFeature {
  name: string;
  included: boolean;
}

export type Period = "month" | "year";

export interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  period: Period;
  features: PlanFeature[];
  popular: boolean;
  is_active: boolean;
  activeMembers: number;
  created_at?: string;
  updated_at?: string;
}

interface PlansContextType {
  plans: Plan[];
  loading: boolean;
  addPlan: (plan: Omit<Plan, "id">) => Promise<void>;
  updatePlan: (id: number, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: number) => Promise<void>;
  togglePlanStatus: (id: number, isActive: boolean) => Promise<void>;
  getPlanById: (id: number) => Plan | undefined;
  refreshPlans: () => Promise<void>;
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

export const PlansProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");
      setPlans(res.data);
    } catch (e) {
      console.error("Failed to load plans", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const addPlan = async (planData: Omit<Plan, "id">) => {
    const res = await api.post("/plans", planData);
    setPlans((prev) => [...prev, res.data.data]);
  };

  const updatePlan = async (id: number, updates: Partial<Plan>) => {
    const res = await api.put(`/plans/${id}`, updates);
    setPlans((prev) => prev.map((p) => (p.id === id ? res.data.data : p)));
  };

  const deletePlan = async (id: number) => {
    await api.delete(`/plans/${id}`);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePlanStatus = async (id: number, isActive: boolean) => {
    const res = await api.patch(`/plans/${id}/status`, { is_active: isActive });
    setPlans((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const getPlanById = (id: number) => plans.find((p) => p.id === id);

  return (
    <PlansContext.Provider
      value={{
        plans,
        loading,
        addPlan,
        updatePlan,
        deletePlan,
        togglePlanStatus,
        getPlanById,
        refreshPlans: fetchPlans,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) throw new Error("usePlans must be used within a PlansProvider");
  return context;
};
