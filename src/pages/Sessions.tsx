import { useState } from "react";
import { Plus, Calendar as CalendarIcon, Clock, Users, MapPin, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SessionFormModal, SessionData } from "@/components/modals/SessionFormModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

const initialSessions: SessionData[] = [
  {
    id: 1,
    name: "Morning Yoga Flow",
    trainer: "Alexandra Kim",
    trainerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    category: "Yoga",
    time: "06:00 AM - 07:00 AM",
    date: "Today",
    location: "Studio A",
    capacity: 20,
    booked: 18,
    status: "upcoming",
  },
  {
    id: 2,
    name: "HIIT Blast",
    trainer: "Marcus Williams",
    trainerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
    category: "HIIT",
    time: "08:00 AM - 09:00 AM",
    date: "Today",
    location: "Main Floor",
    capacity: 15,
    booked: 15,
    status: "full",
  },
  {
    id: 3,
    name: "Strength & Conditioning",
    trainer: "Marcus Williams",
    trainerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
    category: "Strength",
    time: "10:00 AM - 11:30 AM",
    date: "Today",
    location: "Weight Room",
    capacity: 12,
    booked: 8,
    status: "available",
  },
  {
    id: 4,
    name: "Spin Class",
    trainer: "Sophia Lee",
    trainerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    category: "Cardio",
    time: "12:00 PM - 01:00 PM",
    date: "Today",
    location: "Spin Room",
    capacity: 25,
    booked: 20,
    status: "upcoming",
  },
  {
    id: 5,
    name: "Zumba Party",
    trainer: "Emma Rodriguez",
    trainerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    category: "Dance",
    time: "05:00 PM - 06:00 PM",
    date: "Today",
    location: "Studio B",
    capacity: 30,
    booked: 24,
    status: "upcoming",
  },
  {
    id: 6,
    name: "Boxing Fundamentals",
    trainer: "Jordan Mitchell",
    trainerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    category: "Boxing",
    time: "07:00 PM - 08:30 PM",
    date: "Today",
    location: "Combat Zone",
    capacity: 10,
    booked: 6,
    status: "available",
  },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Sessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionData[]>(initialSessions);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionData | null>(null);
  const [deletingSession, setDeletingSession] = useState<SessionData | null>(null);

  const handleSaveSession = (session: SessionData) => {
    if (editingSession) {
      setSessions(sessions.map((s) => (s.id === session.id ? session : s)));
      toast({ title: "Session updated", description: `${session.name} has been updated successfully.` });
    } else {
      setSessions([...sessions, session]);
      toast({ title: "Session created", description: `${session.name} has been created successfully.` });
    }
    setEditingSession(null);
  };

  const handleDeleteSession = () => {
    if (deletingSession) {
      setSessions(sessions.filter((s) => s.id !== deletingSession.id));
      toast({ title: "Session deleted", description: `${deletingSession.name} has been removed.` });
      setDeletingSession(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleBookSession = (session: SessionData) => {
    if (session.booked < session.capacity) {
      const updatedSession = { ...session, booked: session.booked + 1 };
      if (updatedSession.booked === updatedSession.capacity) {
        updatedSession.status = "full";
      }
      setSessions(sessions.map((s) => (s.id === session.id ? updatedSession : s)));
      toast({ title: "Booking confirmed", description: `You have been booked for ${session.name}.` });
    }
  };

  const openEditModal = (session: SessionData) => {
    setEditingSession(session);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (session: SessionData) => {
    setDeletingSession(session);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage gym sessions</p>
        </div>
        <Button
          onClick={() => { setEditingSession(null); setIsFormModalOpen(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
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
        onSave={handleSaveSession}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Session"
        description={`Are you sure you want to delete ${deletingSession?.name}? All bookings will be cancelled.`}
        onConfirm={handleDeleteSession}
      />

      {/* View Toggle & Week Navigation */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
          >
            List View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className={viewMode === "calendar" ? "bg-primary text-primary-foreground" : ""}
          >
            Calendar
          </Button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            {weekDays.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        {sessions.map((session, index) => (
          <div
            key={session.id}
            className="stat-card card-glow flex flex-col md:flex-row md:items-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: `${(index + 2) * 75}ms` }}
          >
            {/* Session Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                  <span className="text-xs font-medium uppercase">
                    {session.category.slice(0, 3)}
                  </span>
                  <CalendarIcon className="w-5 h-5 mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{session.name}</h3>
                    <StatusBadge variant={session.status}>
                      {session.status === "full"
                        ? "Full"
                        : session.status === "available"
                        ? "Available"
                        : "Upcoming"}
                    </StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {session.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {session.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={session.trainerAvatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {session.trainer.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{session.trainer}</p>
                <p className="text-xs text-muted-foreground">{session.category}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="w-48">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Capacity</span>
                </div>
                <span className="font-medium text-foreground">
                  {session.booked}/{session.capacity}
                </span>
              </div>
              <Progress
                value={(session.booked / session.capacity) * 100}
                className="h-2"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEditModal(session)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                disabled={session.status === "full"}
                onClick={() => handleBookSession(session)}
                className={
                  session.status === "full"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                }
              >
                {session.status === "full" ? "Full" : "Book Now"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive"
                onClick={() => openDeleteModal(session)}
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
