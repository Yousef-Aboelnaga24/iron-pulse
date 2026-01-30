import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Star,
  Mail,
  Phone,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrainerFormModal,
  TrainerData,
} from "@/components/modals/TrainerFormModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { api } from "@/api/axios";

// StatusBadge Component
interface StatusBadgeProps {
  variant?: "active" | "inactive" | undefined;
  children: React.ReactNode;
}

function StatusBadge({ variant, children }: StatusBadgeProps) {
  const base = "px-2 py-0.5 rounded text-xs font-medium";
  const color =
    variant === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  return <span className={`${base} ${color}`}>{children}</span>;
}

const Trainers = () => {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerData | null>(
    null,
  );
  const [deletingTrainer, setDeletingTrainer] = useState<TrainerData | null>(
    null,
  );

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get("/trainers");
        setTrainers(res.data.data);
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to fetch trainers" });
      }
    };
    fetchTrainers();
  }, []);

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialties.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSaveTrainer = async (trainer: TrainerData) => {
    try {
      if (editingTrainer) {
        const res = await api.put(`/trainers/${trainer.id}`, trainer);
        setTrainers(
          trainers.map((t) => (t.id === trainer.id ? res.data.data : t)),
        );
        toast({
          title: "Trainer updated",
          description: `${trainer.name} updated successfully.`,
        });
      } else {
        const res = await api.post("/trainers", trainer);
        setTrainers([...trainers, res.data.data]);
        toast({
          title: "Trainer added",
          description: `${trainer.name} added successfully.`,
        });
      }
      setEditingTrainer(null);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save trainer" });
    }
  };

  const handleDeleteTrainer = async () => {
    if (!deletingTrainer) return;
    try {
      await api.delete(`/trainers/${deletingTrainer.id}`);
      setTrainers(trainers.filter((t) => t.id !== deletingTrainer.id));
      toast({
        title: "Trainer removed",
        description: `${deletingTrainer.name} removed.`,
      });
      setDeletingTrainer(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to remove trainer" });
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
          onClick={() => {
            setEditingTrainer(null);
            setIsFormModalOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Add Trainer
        </Button>
      </div>

      {/* Modals */}
      <TrainerFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        trainer={editingTrainer}
        onSave={handleSaveTrainer}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Remove Trainer"
        description={`Are you sure you want to remove ${deletingTrainer?.name}?`}
        onConfirm={handleDeleteTrainer}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 opacity-0 animate-fade-in">
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
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="stat-card card-glow group opacity-0 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-16 w-16 border-2 border-primary/30">
                  <AvatarImage src={trainer.avatar} />
                  <AvatarFallback>
                    {trainer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(trainer)}>
                      Edit Trainer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => openDeleteModal(trainer)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {trainer.name}
                  </h3>
                  <StatusBadge variant={trainer.status}>
                    {trainer.status === "active" ? "Active" : "Inactive"}
                  </StatusBadge>
                </div>
                <div className="flex items-center gap-2">
                  {/* <div className="flex items-center gap-1 text-warning"><Star className="w-4 h-4 fill-current" />{trainer.rating}</div> */}
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-sm text-muted-foreground">
                    {trainer.sessions} sessions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {viewMode === "table" && (
        <div className="stat-card card-glow overflow-hidden opacity-0 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th>Trainer</th>
                  <th>Specialties</th>
                  <th>Sessions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.map((trainer) => (
                  <tr
                    key={trainer.id}
                    className="border-b border-border/50 hover:bg-secondary/30"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                          <AvatarImage src={trainer.avatar} />
                          <AvatarFallback>
                            {trainer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium text-foreground">
                            {trainer.name}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {trainer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">
                        {trainer.specialties}
                      </span>
                    </td>
                    {/* <td className="py-4 px-4">{trainer.rating}</td> */}
                    <td className="py-4 px-4">{trainer.sessions}</td>
                    <td className="py-4 px-4">
                      <StatusBadge variant={trainer.status}>
                        {trainer.status === "active" ? "Active" : "Inactive"}
                      </StatusBadge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(trainer)}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditModal(trainer)}
                            >
                              Edit Trainer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteModal(trainer)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Remove
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
