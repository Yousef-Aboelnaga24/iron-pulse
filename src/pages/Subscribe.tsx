import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Building, Check, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/contexts/PlansContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Subscribe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlanById } = usePlans();
  const { user, isLoggedIn, subscribe } = useUser();
  const { toast } = useToast();

  const plan = getPlanById(Number(id));

  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);

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
  useEffect(() => {
    if (!isLoggedIn) navigate(`/login?redirect=/subscribe/${id}`);
  }, [isLoggedIn, id, navigate]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <Link to="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handlePhotoChange = (type: "profile" | "id", file?: File) => {
    if (!file) return;
    if (type === "profile") setProfilePhoto(file);
    else setIdPhoto(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s\-+()]+$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number";
    if (!formData.gender) newErrors.gender = "Please select your gender";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Select a payment method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fix the errors in the form", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      let profileBase64: string | undefined;
      let idBase64: string | undefined;

      if (profilePhoto) profileBase64 = await convertFileToBase64(profilePhoto);
      if (idPhoto) idBase64 = await convertFileToBase64(idPhoto);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);

      const { success, error } = await subscribe({
        plan_id: plan.id,
        member_id: user?.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentMethod: formData.paymentMethod,
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        height: formData.height || undefined,
        weight: formData.weight || undefined,
        bloodType: formData.bloodType || undefined,
        profilePhoto: profileBase64,
        idPhoto: idBase64,
      });

      if (!success) throw new Error(error);

      toast({ title: "Subscription Successful!", description: `Your ${plan.name} plan is now active.` });
      navigate("/user-dashboard");
    } catch (err: any) {
      toast({ title: "Subscription Failed", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    { id: "visa", name: "Visa / Credit Card", icon: CreditCard },
    { id: "vodafone", name: "Vodafone Cash", icon: Smartphone },
    { id: "gym", name: "Pay at Gym", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to={`/plan/${plan.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Plan Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="stat-card card-glow">
              <h1 className="text-2xl font-bold mb-2">Complete Your Subscription</h1>
              <p className="text-muted-foreground mb-8">Fill in your details to activate your {plan.name} membership</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label="Full Name" value={formData.fullName} onChange={(val) => handleInputChange("fullName", val)} error={errors.fullName} />
                <InputField label="Phone" value={formData.phone} onChange={(val) => handleInputChange("phone", val)} error={errors.phone} />
                <RadioField label="Gender" value={formData.gender} options={[{id:"male",name:"Male"},{id:"female",name:"Female"}]} onChange={(val)=>handleInputChange("gender",val)} error={errors.gender} />
                <InputField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(val) => handleInputChange("dateOfBirth", val)} error={errors.dateOfBirth} />
                <FileField label="Profile Photo" onChange={(file) => handlePhotoChange("profile", file)} />
                <FileField label="ID Photo" onChange={(file) => handlePhotoChange("id", file)} />
                <RadioField label="Payment Method" value={formData.paymentMethod} options={paymentMethods.map(m=>({id:m.id,name:m.name}))} onChange={(val)=>handleInputChange("paymentMethod",val)} error={errors.paymentMethod} />

                <Button type="submit" className="w-full bg-primary text-primary-foreground">
                  {isLoading ? "Processing..." : `Complete Subscription - $${plan.price}`}
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <OrderSummary plan={plan} />
        </div>
      </div>
    </div>
  );
};

/* ===== Sub-components ===== */
const InputField = ({ label, value, onChange, error, type = "text" }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const RadioField = ({ label, value, options, onChange, error }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
      {options.map((opt: any) => (
        <label key={opt.id} className="flex items-center gap-2">
          <RadioGroupItem value={opt.id} /> {opt.name}
        </label>
      ))}
    </RadioGroup>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const FileField = ({ label, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} />
  </div>
);

const OrderSummary = ({ plan }: any) => (
  <div>
    <div className="stat-card card-glow sticky top-8">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium">{plan.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration</span>
          <span>{plan.duration} month{plan.duration>1?'s':''}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price</span>
          <span>${plan.price}/{plan.period}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="font-bold">Total Due</span>
            <span className="text-primary font-bold text-xl">${plan.price}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Subscribe;
