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

export interface SessionData {
  id: number;
  name: string;
  trainer: string;
  trainerAvatar: string;
  category: string;
  time: string;
  date: string;
  location: string;
  capacity: number;
  booked: number;
  status: "upcoming" | "full" | "available";
}

interface SessionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: SessionData | null;
  onSave: (session: SessionData) => void;
}

const trainers = [
  { name: "Marcus Williams", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop" },
  { name: "Alexandra Kim", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
  { name: "Jordan Mitchell", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { name: "Emma Rodriguez", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" },
  { name: "Sophia Lee", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
];

const categories = ["Yoga", "HIIT", "Strength", "Cardio", "Dance", "Boxing", "Spinning", "Pilates"];
const locations = ["Studio A", "Studio B", "Main Floor", "Weight Room", "Spin Room", "Combat Zone"];

export function SessionFormModal({ open, onOpenChange, session, onSave }: SessionFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    trainer: trainers[0].name,
    category: "Yoga",
    startTime: "09:00",
    endTime: "10:00",
    location: "Studio A",
    capacity: 20,
  });

  useEffect(() => {
    if (session) {
      const [startTime, endTime] = session.time.split(" - ").map((t) => {
        const [time, period] = t.split(" ");
        const [hours, minutes] = time.split(":");
        let h = parseInt(hours);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return `${h.toString().padStart(2, "0")}:${minutes}`;
      });
      setFormData({
        name: session.name,
        trainer: session.trainer,
        category: session.category,
        startTime,
        endTime,
        location: session.location,
        capacity: session.capacity,
      });
    } else {
      setFormData({
        name: "",
        trainer: trainers[0].name,
        category: "Yoga",
        startTime: "09:00",
        endTime: "10:00",
        location: "Studio A",
        capacity: 20,
      });
    }
  }, [session, open]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours);
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, "0")}:${minutes} ${period}`;
  };

  const handleSubmit = () => {
    const selectedTrainer = trainers.find((t) => t.name === formData.trainer) || trainers[0];
    const newSession: SessionData = {
      id: session?.id || Date.now(),
      name: formData.name,
      trainer: formData.trainer,
      trainerAvatar: selectedTrainer.avatar,
      category: formData.category,
      time: `${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`,
      date: "Today",
      location: formData.location,
      capacity: formData.capacity,
      booked: session?.booked || 0,
      status: session?.status || "available",
    };
    onSave(newSession);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{session ? "Edit Session" : "Create New Session"}</DialogTitle>
          <DialogDescription>
            {session ? "Update session details below." : "Fill in the details to create a new session."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              placeholder="Morning Yoga Flow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer</Label>
              <Select value={formData.trainer} onValueChange={(v) => setFormData({ ...formData, trainer: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((t) => (
                    <SelectItem key={t.name} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                max={100}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 20 })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
            {session ? "Save Changes" : "Create Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
