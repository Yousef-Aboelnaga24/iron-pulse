import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { LogoutConfirmModal } from "@/components/modals/LogoutConfirmModal";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Members", icon: Users, path: "/members" },
  { title: "Trainers", icon: Dumbbell, path: "/trainers" },
  { title: "Plans", icon: CreditCard, path: "/plans" },
  { title: "Sessions", icon: Calendar, path: "/sessions" },
  { title: "Bookings", icon: BookOpen, path: "/bookings" },
  { title: "Reports", icon: BarChart3, path: "/reports" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "bg-sidebar border-r border-sidebar-border",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse-glow">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-wider">IRON PULSE</span>
                <span className="text-xs text-primary font-medium tracking-widest">GYM</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent group relative",
                  isActive && "bg-sidebar-accent",
                  collapsed && "justify-center px-3"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-sidebar-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-card rounded-md text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                    {item.title}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full",
              "hover:bg-destructive/10 group relative mt-4",
              collapsed && "justify-center px-3"
            )}
          >
            <LogOut className="w-5 h-5 text-destructive" />
            {!collapsed && (
              <span className="text-sm font-medium text-destructive">Logout</span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-card rounded-md text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg text-destructive">
                Logout
              </div>
            )}
          </button>
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  );
}
