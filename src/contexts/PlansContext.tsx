import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  period: string;
  duration: number; // in months
  description: string;
  features: PlanFeature[];
  activeMembers: number;
  status: "active" | "inactive";
  popular: boolean;
}

interface PlansContextType {
  plans: Plan[];
  addPlan: (plan: Omit<Plan, "id">) => void;
  updatePlan: (id: number, plan: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
  togglePlanStatus: (id: number) => void;
  getPlanById: (id: number) => Plan | undefined;
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

const PLANS_STORAGE_KEY = "ironpulse_plans";

const defaultPlans: Plan[] = [
  {
    id: 1,
    name: "Basic",
    price: 29,
    period: "month",
    duration: 1,
    description: "Perfect for beginners starting their fitness journey",
    features: [
      { name: "Access to gym equipment", included: true },
      { name: "Locker room access", included: true },
      { name: "Basic fitness assessment", included: true },
      { name: "Group classes", included: false },
      { name: "Personal training sessions", included: false },
      { name: "Nutrition consultation", included: false },
    ],
    activeMembers: 856,
    status: "active",
    popular: false,
  },
  {
    id: 2,
    name: "Gold",
    price: 49,
    period: "month",
    duration: 1,
    description: "Great for regular gym-goers who want more variety",
    features: [
      { name: "Access to gym equipment", included: true },
      { name: "Locker room access", included: true },
      { name: "Basic fitness assessment", included: true },
      { name: "Group classes", included: true },
      { name: "Personal training sessions", included: false },
      { name: "Nutrition consultation", included: false },
    ],
    activeMembers: 624,
    status: "active",
    popular: false,
  },
  {
    id: 3,
    name: "Premium",
    price: 79,
    period: "month",
    duration: 1,
    description: "The ultimate fitness experience with all amenities",
    features: [
      { name: "Access to gym equipment", included: true },
      { name: "Locker room access", included: true },
      { name: "Basic fitness assessment", included: true },
      { name: "Group classes", included: true },
      { name: "2 Personal training sessions/month", included: true },
      { name: "Nutrition consultation", included: true },
    ],
    activeMembers: 412,
    status: "active",
    popular: true,
  },
  {
    id: 4,
    name: "Student",
    price: 19,
    period: "month",
    duration: 1,
    description: "Special discounted rate for students with valid ID",
    features: [
      { name: "Access to gym equipment", included: true },
      { name: "Locker room access", included: true },
      { name: "Basic fitness assessment", included: true },
      { name: "Limited group classes", included: true },
      { name: "Personal training sessions", included: false },
      { name: "Nutrition consultation", included: false },
    ],
    activeMembers: 264,
    status: "active",
    popular: false,
  },
];

export const PlansProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>(() => {
    const stored = localStorage.getItem(PLANS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPlans;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const addPlan = (planData: Omit<Plan, "id">) => {
    // TODO: Backend integration - create plan via API
    const newPlan: Plan = {
      ...planData,
      id: Date.now(),
    };
    setPlans((prev) => [...prev, newPlan]);
  };

  const updatePlan = (id: number, updates: Partial<Plan>) => {
    // TODO: Backend integration - update plan via API
    setPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
    );
  };

  const deletePlan = (id: number) => {
    // TODO: Backend integration - delete plan via API
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  const togglePlanStatus = (id: number) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? { ...plan, status: plan.status === "active" ? "inactive" : "active" }
          : plan
      )
    );
  };

  const getPlanById = (id: number) => {
    return plans.find((plan) => plan.id === id);
  };

  return (
    <PlansContext.Provider
      value={{
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        togglePlanStatus,
        getPlanById,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (context === undefined) {
    throw new Error("usePlans must be used within a PlansProvider");
  }
  return context;
};
