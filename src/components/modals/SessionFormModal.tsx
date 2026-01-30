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

/* ================= TYPES ================= */

export interface Trainer {
  id: number;
  name: string;
  photo?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface SessionFormData {
  id?: number;
  name: string;
  trainer_id: number;
  category_id: number;
  start_date: string;
  end_date: string;
  capacity: number;
  status?: "upcoming" | "ongoing" | "completed";
  trainer_name?: string;
  trainerPhoto?: string;
  category_name?: string;
  booked?: number;
}

interface SessionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: SessionFormData | null;
  trainers: Trainer[];
  categories: Category[];
  onSave: (data: SessionFormData) => void;
}

/* ================= COMPONENT ================= */

export function SessionFormModal({
  open,
  onOpenChange,
  session,
  trainers,
  categories,
  onSave,
}: SessionFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    trainer_id: 0,
    category_id: 0,
    startTime: "09:00",
    endTime: "10:00",
    capacity: 10,
  });

  /* ===== Helpers ===== */
  const toTime = (dateStr?: string) => dateStr?.slice(11, 16) || "09:00";
  const getDatePart = (dateStr?: string) =>
    dateStr?.slice(0, 10) || new Date().toISOString().slice(0, 10);
  const combineDateTime = (date: string, time: string) =>
    `${date} ${time}:00`;

  /* ===== Fill form when editing ===== */
  useEffect(() => {
    if (session) {
      setFormData({
        name: session.name,
        trainer_id: session.trainer_id,
        category_id: session.category_id,
        startTime: toTime(session.start_date),
        endTime: toTime(session.end_date),
        capacity: session.capacity,
      });
    } else {
      setFormData({
        name: "",
        trainer_id: trainers[0]?.id || 0,
        category_id: categories[0]?.id || 0,
        startTime: "09:00",
        endTime: "10:00",
        capacity: 10,
      });
    }
  }, [session, open, trainers, categories]);

  /* ===== Submit ===== */
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Session name is required");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      alert("End time must be after start time");
      return;
    }

    const capacity = Math.min(Math.max(formData.capacity, 1), 25);

    const baseDate = getDatePart(session?.start_date); // 👈 تاريخ قديم أو تاريخ النهارده

    const payload: SessionFormData = {
      id: session?.id,
      name: formData.name,
      trainer_id: formData.trainer_id,
      category_id: formData.category_id,
      start_date: combineDateTime(baseDate, formData.startTime),
      end_date: combineDateTime(baseDate, formData.endTime),
      capacity,
      status: session?.status ?? "upcoming",
    };

    onSave(payload);
    onOpenChange(false);
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {session ? "Edit Session" : "Create Session"}
          </DialogTitle>
          <DialogDescription>
            {session
              ? "Update session details below."
              : "Fill in the details to create a new session."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              placeholder="Morning Yoga"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Trainer + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trainer</Label>
              <Select
                value={String(formData.trainer_id)}
                onValueChange={(v) =>
                  setFormData({ ...formData, trainer_id: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={String(formData.category_id)}
                onValueChange={(v) =>
                  setFormData({ ...formData, category_id: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label>Capacity</Label>
            <Input
              type="number"
              min={1}
              max={25}
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: Number(e.target.value) || 1,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {session ? "Save Changes" : "Create Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
