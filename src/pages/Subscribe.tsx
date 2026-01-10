import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, CreditCard, Smartphone, Building, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePlans } from "@/contexts/PlansContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

const Subscribe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlanById } = usePlans();
  const { user, isLoggedIn, subscribe } = useUser();
  const { toast } = useToast();
  
  const plan = getPlanById(Number(id));
  
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    bloodType: "",
    paymentMethod: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate(`/login?redirect=/subscribe/${id}`);
    return null;
  }

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpload = (type: "profile" | "id", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setProfilePhoto(reader.result as string);
      } else {
        setIdPhoto(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);
    
    // TODO: Backend integration - create subscription via API
    subscribe({
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      paymentMethod: formData.paymentMethod,
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      height: formData.height,
      weight: formData.weight,
      bloodType: formData.bloodType,
      profilePhoto: profilePhoto || undefined,
      idPhoto: idPhoto || undefined,
    });
    
    toast({
      title: "Subscription Successful!",
      description: `Welcome to Iron Pulse! Your ${plan.name} plan is now active.`,
    });
    
    // Redirect to user dashboard
    navigate("/user-dashboard");
    
    setIsLoading(false);
  };

  const paymentMethods = [
    { id: "visa", name: "Visa / Credit Card", icon: CreditCard, description: "Pay securely with your card" },
    { id: "vodafone", name: "Vodafone Cash", icon: Smartphone, description: "Pay via mobile wallet" },
    { id: "gym", name: "Pay at Gym", icon: Building, description: "Pay in person at reception" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          to={`/plan/${plan.id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plan Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="stat-card card-glow">
              <h1 className="text-2xl font-bold text-foreground mb-2">Complete Your Subscription</h1>
              <p className="text-muted-foreground mb-8">
                Fill in your details to activate your {plan.name} membership
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="John Doe"
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+20 100 123 4567"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-sm text-destructive">{errors.gender}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className={errors.dateOfBirth ? "border-destructive" : ""}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Health Information (Optional) */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm flex items-center justify-center">2</span>
                    Health Information
                    <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        placeholder="175"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) => handleInputChange("bloodType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Photo Upload (Optional) */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm flex items-center justify-center">3</span>
                    Photos
                    <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                          profilePhoto ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => document.getElementById("profilePhoto")?.click()}
                      >
                        <input
                          id="profilePhoto"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload("profile", file);
                          }}
                        />
                        {profilePhoto ? (
                          <div className="space-y-2">
                            <img
                              src={profilePhoto}
                              alt="Profile"
                              className="w-20 h-20 rounded-full mx-auto object-cover"
                            />
                            <p className="text-sm text-primary">Photo uploaded</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>ID Photo</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                          idPhoto ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => document.getElementById("idPhoto")?.click()}
                      >
                        <input
                          id="idPhoto"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload("id", file);
                          }}
                        />
                        {idPhoto ? (
                          <div className="space-y-2">
                            <img
                              src={idPhoto}
                              alt="ID"
                              className="w-20 h-20 rounded-lg mx-auto object-cover"
                            />
                            <p className="text-sm text-primary">Photo uploaded</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
                    Payment Method *
                  </h2>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleInputChange("paymentMethod", method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <method.icon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="cursor-pointer font-medium">
                            {method.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        {formData.paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.paymentMethod && (
                    <p className="text-sm text-destructive mt-2">{errors.paymentMethod}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Complete Subscription - $${plan.price}`}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="stat-card card-glow sticky top-8">
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
                    <span className="text-foreground font-bold">Total Due</span>
                    <span className="text-primary font-bold text-xl">${plan.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Plan Includes:</h4>
                <ul className="space-y-2">
                  {plan.features
                    .filter((f) => f.included)
                    .slice(0, 4)
                    .map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
