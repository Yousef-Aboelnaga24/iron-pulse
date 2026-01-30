import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Briefcase,
  BadgeCheck,
  MapPin,
  Dumbbell,
} from "lucide-react";

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  photo?: string;
  date_of_birth?: string;
  specialties?: string;
  hire_date?: string;
  status?: string;
  address?: {
    city?: string;
    street?: string;
  };
}

export default function TrainerDetails() {
  const { id } = useParams<{ id: string }>();
  const trainerId = Number(id);

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainerId) return;

    api
      .get(`/trainers/${trainerId}`)
      .then(res => setTrainer(res.data))
      .finally(() => setLoading(false));
  }, [trainerId]);

  if (!trainerId) return <p className="text-destructive">Invalid trainer</p>;
  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!trainer) return <p className="text-destructive">Trainer not found</p>;

  return (
    <div className="p-6 bg-card rounded-xl shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border">
          <AvatarImage src={trainer.photo} alt={trainer.name} />
          <AvatarFallback>
            {trainer.name}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold">{trainer.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            {trainer.email}
          </div>
          {trainer.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              {trainer.phone}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <InfoRow icon={User} label="Gender" value={trainer.gender} />
        <InfoRow icon={Calendar} label="Birth Date" value={trainer.date_of_birth} />
        <InfoRow icon={Briefcase} label="Hire Date" value={trainer.hire_date} />
        <InfoRow icon={BadgeCheck} label="Status" value={trainer.status} />
        <InfoRow
          icon={Dumbbell}
          label="Specialties"
          value={trainer.specialties}
        />
        <InfoRow
          icon={MapPin}
          label="Address"
          value={
            trainer.address
              ? `${trainer.address.street ?? ""} ${trainer.address.city ?? ""}`
              : undefined
          }
        />
      </div>
    </div>
  );
}

/* Reusable row */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="font-medium text-foreground">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
