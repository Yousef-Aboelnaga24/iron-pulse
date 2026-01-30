// src/pages/Dashboard.tsx
import { useAdmin } from "@/contexts/AdminContext";
import { Link, Navigate } from "react-router-dom";
import {
  Users,
  Dumbbell,
  Calendar,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { MembershipChart } from "@/components/dashboard/MembershipChart";
import { SessionsOverview } from "@/components/dashboard/SessionsOverview";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

const Dashboard = () => {
  const { profile } = useAdmin();

  // لو مش موجود أو مش ادمن، اعمل redirect
  if (!profile) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 opacity-0 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening at Iron Pulse Gym today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value="2,847"
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          delay={100}
        />
        <StatCard
          title="Active Trainers"
          value="24"
          change="2 new this week"
          changeType="positive"
          icon={Dumbbell}
          delay={200}
        />
        <StatCard
          title="Sessions Today"
          value="18"
          change="6 remaining"
          changeType="neutral"
          icon={Calendar}
          delay={300}
        />
        <StatCard
          title="Monthly Revenue"
          value="$84,250"
          change="+18.2% from last month"
          changeType="positive"
          icon={CreditCard}
          delay={400}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Active Memberships"
          value="2,156"
          change="89% of total members"
          changeType="positive"
          icon={TrendingUp}
          delay={500}
        />
        <StatCard
          title="Check-ins Today"
          value="342"
          change="Peak at 6-8 PM"
          changeType="neutral"
          icon={Activity}
          delay={600}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <MembershipChart />
        <SessionsOverview />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />

        {/* Quick Actions */}
        <div className="stat-card card-glow">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                label: "Add Member",
                path: "/members",
                color: "bg-primary/20 text-primary",
              },
              {
                icon: Dumbbell,
                label: "Add Trainer",
                path: "/trainers",
                color: "bg-info/20 text-info",
              },
              {
                icon: Calendar,
                label: "Create Session",
                color: "bg-warning/20 text-warning",
              },
              {
                icon: CreditCard,
                label: "New Plan",
                path: "plans",
                color: "bg-success/20 text-success",
              },
            ].map((action, index) => (
              <Link
                to={action.path}
                key={action.label}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-all hover:scale-105 opacity-0 animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className={`p-4 rounded-xl ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
