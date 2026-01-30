import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  SessionFormModal,
  SessionFormData,
} from "@/components/modals/SessionFormModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/api/axios";

interface Trainer {
  id: number;
  name: string;
  photo: string;
}

interface Category {
  id: number;
  name: string;
}

const Sessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionFormData[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionFormData | null>(
    null,
  );
  const [deletingSession, setDeletingSession] =
    useState<SessionFormData | null>(null);

  const fetchTrainers = async () => {
    api
      .get("/trainers")
      .then((res) => {
        const trainersArray = Array.isArray(res.data)
          ? res.data
          : res.data.data;
        setTrainers(trainersArray || []);
      })
      .catch(() => setTrainers([]));
  };

  const fetchCategories = async () => {
    api
      .get("/categories")
      .then((res) => {
        const categoriesArray = Array.isArray(res.data)
          ? res.data
          : res.data.data;
        setCategories(categoriesArray || []);
      })
      .catch(() => setCategories([]));
  };

  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions");
      const data: SessionFormData[] = res.data.data.map((s: any) => ({
        ...s,
        trainer_name: s.trainer_name || "No trainer",
        trainerAvatar: s.trainer?.photo || "",
        category_name: s.category_name || "No category",
        booked: s.members?.length || 0,
      }));
      setSessions(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to fetch sessions." });
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchTrainers();
    fetchCategories();
  }, []);

  /* ===== Save Session ===== */
  const handleSaveSession = async (session: SessionFormData) => {
    try {
      if (editingSession) {
        const res = await api.put(`/sessions/${session.id}`, session);
        setSessions(
          sessions.map((s) => (s.id === session.id ? res.data.data : s)),
        );
        toast({
          title: "Updated",
          description: `${session.name} updated successfully.`,
        });
      } else {
        const res = await api.post("/sessions", session);
        setSessions([...sessions, res.data.data]);
        toast({
          title: "Created",
          description: `${session.name} created successfully.`,
        });
      }
      setEditingSession(null);
      setIsFormModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save session." });
    }
  };

  /* ===== Delete Session ===== */
  const handleDeleteSession = async () => {
    if (!deletingSession) return;
    try {
      await api.delete(`/sessions/${deletingSession.id}`);
      setSessions(sessions.filter((s) => s.id !== deletingSession.id));
      toast({
        title: "Deleted",
        description: `${deletingSession.name} deleted.`,
      });
      setIsDeleteModalOpen(false);
      setDeletingSession(null);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete session." });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Button
          onClick={() => {
            setEditingSession(null);
            setIsFormModalOpen(true);
          }}
          className="bg-primary text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Session
        </Button>
      </div>

      {/* Form Modal */}
      <SessionFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        session={editingSession}
        trainers={trainers}
        categories={categories}
        onSave={handleSaveSession}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Session"
        description={`Are you sure you want to delete ${deletingSession?.name}?`}
        onConfirm={handleDeleteSession}
      />

      {/* Sessions List */}
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="card flex justify-between p-4 items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{session.name}</h3>
              <p className="text-sm text-muted-foreground">
                {session.category_name}
              </p>
              {/* <p className="text-sm">{session.time}</p> */}
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={session.trainerPhoto} />
                <AvatarFallback>{session.trainer_name[0]}</AvatarFallback>
              </Avatar>
              <p>{session.trainer_name}</p>
              <Progress
                value={(session.booked / session.capacity) * 100}
                className="w-24 h-2"
              />
              <StatusBadge variant={session.status}>
                {session.status}
              </StatusBadge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingSession(session);
                  setIsFormModalOpen(true);
                }}
              >
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDeletingSession(session);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Sessions;
