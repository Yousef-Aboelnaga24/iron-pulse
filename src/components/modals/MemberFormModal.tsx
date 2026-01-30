import { useState, useEffect } from "react";
import { api } from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export interface MemberData {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  date_of_birth?: string;
  photo?: string;
  height?: number;
  weight?: number;
  blood_type?: string;
  note?: string;
  join_date?: string;
  plan?: string;
  address?: {
    city?: string;
    street?: string;
    building_num?: string;
  };
}

interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
}

interface MemberFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: MemberData | null;
  onSave: (member: MemberData) => void;
}

export function MemberFormModal({
  open,
  onOpenChange,
  member,
  onSave,
}: MemberFormModalProps) {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    plan: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    plan: "basic",
  });

  const [plans, setPlans] = useState<Plan[]>([]);
  // Fetch Plan
  const fetchPlans = async () => {
    api
      .get("/plans")
      .then((res) => {
        const plansArray = Array.isArray(res.data) ? res.data : res.date.data;
        setPlans(plansArray || []);
      })
      .catch(() => setPlans([]));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (member) {
      const [firstName, ...rest] = member.name.split(" ");
      setFormData({
        firstName,
        lastName: rest.join(" "),
        email: member.email,
        phone: member.phone,
        plan: member.plan.toLowerCase(),
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        plan: "basic",
      });
    }
  }, [member, open]);

  const handleSubmit = () => {
    const today = new Date();
    const newMember: MemberData = {
      id: member?.id || Date.now(),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      plan: formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1),
      joinDate:
        member?.joinDate ||
        today.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      avatar:
        member?.avatar || avatars[Math.floor(Math.random() * avatars.length)],
    };
    onSave(newMember);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {member
              ? "Update member details below."
              : "Fill in the details to register a new gym member."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Membership Plan</Label>
              <Select
                value={formData.plan}
                onValueChange={(v) => setFormData({ ...formData, plan: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan)=>(
                    <SelectItem value={String(plan.id)} key={plan.id}>{plan.name} - ${plan.price}/{plan.period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as "active" | "expired" | "pending" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground"
          >
            {member ? "Save Changes" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
