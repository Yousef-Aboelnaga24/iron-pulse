import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface TrainerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  rating: number;
  sessions: number;
  status: "active" | "inactive";
  avatar: string;
}

interface TrainerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainer?: TrainerData | null;
  onSave: (trainer: TrainerData) => void;
}

const avatars = [
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
];

const specialtyOptions = [
  "Strength Training", "HIIT", "CrossFit", "Yoga", "Pilates",
  "Meditation", "Cardio", "Boxing", "Weight Loss", "Zumba",
  "Dance Fitness", "Aerobics", "Personal Training", "Nutrition",
  "Spinning", "Endurance"
];

export function TrainerFormModal({ open, onOpenChange, trainer, onSave }: TrainerFormModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    specialties: string[];
    status: "active" | "inactive";
  }>({
    name: "",
    email: "",
    phone: "",
    specialties: [],
    status: "active",
  });

  useEffect(() => {
    if (trainer) {
      setFormData({
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        specialties: trainer.specialties,
        status: trainer.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialties: [],
        status: "active",
      });
    }
  }, [trainer, open]);

  const handleAddSpecialty = (specialty: string) => {
    if (!formData.specialties.includes(specialty)) {
      setFormData({ ...formData, specialties: [...formData.specialties, specialty] });
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    });
  };

  const handleSubmit = () => {
    const newTrainer: TrainerData = {
      id: trainer?.id || Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialties: formData.specialties,
      rating: trainer?.rating || 4.5,
      sessions: trainer?.sessions || 0,
      status: formData.status,
      avatar: trainer?.avatar || avatars[Math.floor(Math.random() * avatars.length)],
    };
    onSave(newTrainer);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{trainer ? "Edit Trainer" : "Add New Trainer"}</DialogTitle>
          <DialogDescription>
            {trainer ? "Update trainer details below." : "Fill in the details to add a new trainer."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Marcus Williams"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="trainer@ironpulse.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 100"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Specialties</Label>
            <Select onValueChange={handleAddSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Add specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialtyOptions.filter((s) => !formData.specialties.includes(s)).map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="gap-1">
                  {specialty}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as "active" | "inactive" })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
            {trainer ? "Save Changes" : "Add Trainer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
