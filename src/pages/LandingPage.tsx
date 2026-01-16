import { Link, useNavigate } from "react-router-dom";
import { 
  Dumbbell, 
  Users, 
  Calendar, 
  Award, 
  ChevronRight, 
  Check,
  X,
  Zap,
  ArrowRight,
  Menu,
  User,
  LogOut,
  CreditCard,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/contexts/PlansContext";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirmModal } from "@/components/modals/LogoutConfirmModal";

const LandingPage = () => {
  const navigate = useNavigate();
  const { plans } = usePlans();
  const { user, isLoggedIn, isSubscribed, isAdmin, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const activePlans = plans.filter((plan) => plan.status === "active");

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const features = [
    {
      icon: Dumbbell,
      title: "Premium Equipment",
      description: "State-of-the-art machines and free weights for every workout",
    },
    {
      icon: Users,
      title: "Expert Trainers",
      description: "Certified professionals to guide your fitness journey",
    },
    {
      icon: Calendar,
      title: "Flexible Sessions",
      description: "Book classes and training sessions that fit your schedule",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Join thousands of members who transformed their lives",
    },
  ];

  const stats = [
    { value: "2,500+", label: "Active Members" },
    { value: "50+", label: "Expert Trainers" },
    { value: "100+", label: "Weekly Classes" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                IRON<span className="text-primary">PULSE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#plans" className="text-muted-foreground hover:text-foreground transition-colors">
                Plans
              </a>
              <a href="#stats" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-1 pr-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {getInitials(user?.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <CreditCard className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-xs ${isSubscribed ? "text-primary" : "text-warning"}`}>
                          {isSubscribed ? "Subscribed" : "Not Subscribed"}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isSubscribed && !isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/user-dashboard" className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          My Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setShowLogoutModal(true)} 
                      className="text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-foreground">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#plans"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Plans
              </a>
              <a
                href="#stats"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <div className="pt-3 border-t border-border space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials(user?.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className={`text-xs ${isSubscribed ? "text-primary" : "text-warning"}`}>
                          {isSubscribed ? "Subscribed" : "Not Subscribed"}
                        </p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {isSubscribed && !isAdmin && (
                      <Link to="/user-dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          My Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              Transform Your Body,
              <br />
              <span className="text-primary glow-text">Transform Your Life</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join Iron Pulse Gym and experience world-class facilities, expert training,
              and a community that pushes you to be your best self.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#plans">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  View Membership Plans
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary glow-text">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Iron Pulse</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to achieve your fitness goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="stat-card card-glow p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Membership <span className="text-primary">Plans</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan that fits your fitness goals and budget
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className={`stat-card card-glow relative ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <Link to={`/plan/${plan.id}`}>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Plan Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          {activePlans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No plans available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of members who have transformed their lives at Iron Pulse Gym
          </p>
          {isLoggedIn ? (
            isSubscribed ? (
              <Link to="/user-dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Go to My Dashboard
                </Button>
              </Link>
            ) : (
              <a href="#plans">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Choose a Plan
                </Button>
              </a>
            )
          ) : (
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started Today
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              IRON<span className="text-primary">PULSE</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Iron Pulse Gym. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground">
              Plans
            </a>
          </div>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default LandingPage;
