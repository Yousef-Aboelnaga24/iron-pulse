import { Link, useNavigate } from "react-router-dom";
import { User, Calendar, CreditCard, Clock, Dumbbell, LogOut, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import { format } from "date-fns";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, subscription, isLoggedIn, isSubscribed, logout } = useUser();

  // Redirect if not logged in or not subscribed
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!isSubscribed) {
      navigate("/");
    }
  }, [isLoggedIn, isSubscribed, navigate]);

  if (!isLoggedIn || !isSubscribed || !subscription) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  IRON<span className="text-primary">PULSE</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="stat-card card-glow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                {subscription.profilePhoto ? (
                  <img src={subscription.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{subscription.fullName}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{subscription.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span className="text-foreground capitalize">{subscription.gender}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span className="text-foreground">{subscription.dateOfBirth}</span></div>
              {subscription.height && <div className="flex justify-between"><span className="text-muted-foreground">Height</span><span className="text-foreground">{subscription.height} cm</span></div>}
              {subscription.weight && <div className="flex justify-between"><span className="text-muted-foreground">Weight</span><span className="text-foreground">{subscription.weight} kg</span></div>}
              {subscription.bloodType && <div className="flex justify-between"><span className="text-muted-foreground">Blood Type</span><span className="text-foreground">{subscription.bloodType}</span></div>}
            </div>
          </div>

          {/* Subscription Card */}
          <div className="stat-card card-glow lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-6">Subscription Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
                  <Dumbbell className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="text-lg font-bold text-foreground">{subscription.planName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                  <CreditCard className="w-8 h-8 text-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-bold text-foreground">${subscription.price}/month</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                  <Calendar className="w-8 h-8 text-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-lg font-bold text-foreground">{format(new Date(subscription.startDate), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                  <Clock className="w-8 h-8 text-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="text-lg font-bold text-foreground">{format(new Date(subscription.endDate), "MMM d, yyyy")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subscription Status</p>
                  <p className="text-lg font-bold text-primary">Active</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-foreground font-medium capitalize">{subscription.paymentMethod.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
