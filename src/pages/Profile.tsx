import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Camera, 
  Save, 
  Mail, 
  CreditCard,
  Calendar,
  Loader2,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const navigate = useNavigate();
  const { user, subscription, isSubscribed, updateProfile, isAdmin } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(user?.avatar);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // TODO: Backend integration - update profile via API
    // Profile changes persist in localStorage and update across Navbar & Landing Page
    updateProfile({
      name: name.trim(),
      avatar: previewAvatar,
    });

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
          <h1 className="text-lg font-semibold text-foreground">My Profile</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-2">
            <Card className="backdrop-blur-xl bg-card/60 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your name and profile picture. Changes will reflect across the app.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-xl shadow-primary/10">
                        <AvatarImage src={previewAvatar} alt={name} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                          {getInitials(name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/30"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium mb-1">
                        Profile Photo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click the camera icon to upload a new photo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: Square image, at least 200x200px
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground/90">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Field (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground/90">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="pl-11 h-12 bg-muted/50 border-border/30"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Side Cards */}
          <div className="space-y-6">
            {/* Role Badge Card */}
            {isAdmin && (
              <Card className="backdrop-blur-xl bg-card/60 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Administrator</p>
                      <p className="text-xs text-muted-foreground">Full system access</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription Status Card */}
            <Card className="backdrop-blur-xl bg-card/60 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isSubscribed ? "bg-primary animate-pulse" : "bg-warning"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {isAdmin ? "Admin Account" : isSubscribed ? "Active" : "Not Subscribed"}
                  </span>
                </div>

                {!isAdmin && isSubscribed && subscription ? (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Plan</p>
                        <p className="text-sm font-medium text-primary">{subscription.planName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-sm font-medium">${subscription.price}/month</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Valid Until</p>
                          <p className="text-sm font-medium">
                            {new Date(subscription.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link to="/user-dashboard">
                      <Button variant="outline" className="w-full mt-2 border-border/50 hover:bg-primary/10 hover:border-primary/50">
                        View Dashboard
                      </Button>
                    </Link>
                  </>
                ) : !isAdmin ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      You don't have an active subscription yet.
                    </p>
                    <Link to="/#plans">
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all">
                        View Plans
                      </Button>
                    </Link>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
