import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  X, 
  Dumbbell, 
  Users, 
  Calendar,
  Zap,
  Clock,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/contexts/PlansContext";
import { useUser } from "@/contexts/UserContext";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlanById } = usePlans();
  const { isLoggedIn } = useUser();
  
  const plan = getPlanById(Number(id));

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Plan Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubscribe = () => {
    if (!isLoggedIn) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/subscribe/${plan.id}`);
    } else {
      navigate(`/subscribe/${plan.id}`);
    }
  };

  const benefits = [
    { icon: Dumbbell, text: "Access to all gym equipment" },
    { icon: Users, text: "Community of fitness enthusiasts" },
    { icon: Calendar, text: "Flexible booking system" },
    { icon: Clock, text: "Extended gym hours" },
    { icon: Shield, text: "Satisfaction guaranteed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/#plans"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{plan.name} Plan</h1>
                {plan.popular && (
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            <div className="text-left md:text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary glow-text">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.duration} month{plan.duration > 1 ? "s" : ""} duration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features */}
          <div className="lg:col-span-2 space-y-8">
            <div className="stat-card card-glow">
              <h2 className="text-xl font-bold text-foreground mb-6">Plan Features</h2>
              <div className="space-y-4">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      feature.included ? "bg-primary/10" : "bg-muted/50"
                    }`}
                  >
                    {feature.included ? (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <span
                      className={`${
                        feature.included ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card card-glow">
              <h2 className="text-xl font-bold text-foreground mb-6">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="stat-card card-glow sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{plan.duration} month{plan.duration > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-foreground">${plan.price}/{plan.period}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-foreground font-bold">Total</span>
                    <span className="text-primary font-bold text-xl">${plan.price}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubscribe}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Subscribe Now
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {!isLoggedIn && "You'll need to login or register first."}
              </p>
            </div>

            <div className="stat-card card-glow">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{plan.activeMembers}</strong> members on this plan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
