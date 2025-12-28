import { useState } from "react";
import { Search, Plus, Star, Mail, Phone, Edit, MoreVertical, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrainerFormModal, TrainerData } from "@/components/modals/TrainerFormModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

const initialTrainers: TrainerData[] = [
  {
    id: 1,
    name: "Marcus Williams",
    email: "marcus.w@ironpulse.com",
    phone: "+1 234 567 100",
    specialties: ["Strength Training", "HIIT", "CrossFit"],
    rating: 4.9,
    sessions: 156,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Alexandra Kim",
    email: "alex.k@ironpulse.com",
    phone: "+1 234 567 101",
    specialties: ["Yoga", "Pilates", "Meditation"],
    rating: 4.8,
    sessions: 203,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Jordan Mitchell",
    email: "jordan.m@ironpulse.com",
    phone: "+1 234 567 102",
    specialties: ["Cardio", "Boxing", "Weight Loss"],
    rating: 4.7,
    sessions: 98,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    email: "emma.r@ironpulse.com",
    phone: "+1 234 567 103",
    specialties: ["Zumba", "Dance Fitness", "Aerobics"],
    rating: 4.9,
    sessions: 187,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Chris Anderson",
    email: "chris.a@ironpulse.com",
    phone: "+1 234 567 104",
    specialties: ["Personal Training", "Nutrition"],
    rating: 4.6,
    sessions: 75,
    status: "inactive",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 6,
    name: "Sophia Lee",
    email: "sophia.l@ironpulse.com",
    phone: "+1 234 567 105",
    specialties: ["Spinning", "Endurance", "Cardio"],
    rating: 4.8,
    sessions: 142,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
];

const Trainers = () => {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<TrainerData[]>(initialTrainers);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerData | null>(null);
  const [deletingTrainer, setDeletingTrainer] = useState<TrainerData | null>(null);

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveTrainer = (trainer: TrainerData) => {
    if (editingTrainer) {
      setTrainers(trainers.map((t) => (t.id === trainer.id ? trainer : t)));
      toast({ title: "Trainer updated", description: `${trainer.name} has been updated successfully.` });
    } else {
      setTrainers([...trainers, trainer]);
      toast({ title: "Trainer added", description: `${trainer.name} has been added successfully.` });
    }
    setEditingTrainer(null);
  };

  const handleDeleteTrainer = () => {
    if (deletingTrainer) {
      setTrainers(trainers.filter((t) => t.id !== deletingTrainer.id));
      toast({ title: "Trainer removed", description: `${deletingTrainer.name} has been removed.` });
      setDeletingTrainer(null);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (trainer: TrainerData) => {
    setEditingTrainer(trainer);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (trainer: TrainerData) => {
    setDeletingTrainer(trainer);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trainers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gym trainers and their schedules
          </p>
        </div>
        <Button
          onClick={() => { setEditingTrainer(null); setIsFormModalOpen(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Trainer
        </Button>
      </div>

      {/* Form Modal */}
      <TrainerFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        trainer={editingTrainer}
        onSave={handleSaveTrainer}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Remove Trainer"
        description={`Are you sure you want to remove ${deletingTrainer?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteTrainer}
      />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search trainers or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-primary text-primary-foreground" : ""}
          >
            Table
          </Button>
        </div>
      </div>

      {/* Trainers Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer, index) => (
            <div
              key={trainer.id}
              className="stat-card card-glow group opacity-0 animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-16 w-16 border-2 border-primary/30">
                  <AvatarImage src={trainer.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {trainer.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(trainer)}>Edit Trainer</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ title: "Schedule", description: `Viewing schedule for ${trainer.name}` })}>
                      View Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(trainer)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{trainer.name}</h3>
                  <StatusBadge variant={trainer.status}>
                    {trainer.status === "active" ? "Active" : "Inactive"}
                  </StatusBadge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{trainer.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-sm text-muted-foreground">{trainer.sessions} sessions</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 rounded-md bg-secondary/50 text-xs font-medium text-muted-foreground"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {trainer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {trainer.phone}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => openEditModal(trainer)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Trainers Table */}
      {viewMode === "table" && (
        <div className="stat-card card-glow overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Trainer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Specialties</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Sessions</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.map((trainer) => (
                  <tr key={trainer.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                          <AvatarImage src={trainer.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {trainer.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium text-foreground">{trainer.name}</span>
                          <p className="text-sm text-muted-foreground">{trainer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {trainer.specialties.slice(0, 2).map((specialty) => (
                          <span key={specialty} className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">
                            {specialty}
                          </span>
                        ))}
                        {trainer.specialties.length > 2 && (
                          <span className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">
                            +{trainer.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{trainer.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{trainer.sessions}</td>
                    <td className="py-4 px-4">
                      <StatusBadge variant={trainer.status}>
                        {trainer.status === "active" ? "Active" : "Inactive"}
                      </StatusBadge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(trainer)}>
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(trainer)}>Edit Trainer</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(trainer)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Trainers;
