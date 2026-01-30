import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MemberFormModal,
  MemberData,
} from "@/components/modals/MemberFormModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/api/axios";

interface Plan {
  id: number;
  name: string;
}

const Members = () => {
  const { toast } = useToast();

  const [members, setMembers] = useState<MemberData[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberData | null>(null);
  const [deletingMember, setDeletingMember] = useState<MemberData | null>(null);

  // Fetch members
  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data.data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load members",
        variant: "destructive",
      });
    }
  };

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
    fetchMembers();
    fetchPlans();
  }, []);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan =
        selectedPlan === "all" || member.plan?.toLowerCase() === selectedPlan;
      return matchesSearch && matchesPlan;
    });
  }, [members, searchQuery, selectedPlan]);

  // Save member (add or update)
  const handleSaveMember = async (member: MemberData) => {
    try {
      const formData = new FormData();
      Object.entries(member).forEach(([key, value]) => {
        if (value !== null && value !== undefined)
          formData.append(key, value as any);
      });

      if (editingMember) {
        const res = await api.put(`/members/${editingMember.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMembers(
          members.map((m) => (m.id === editingMember.id ? res.data.data : m)),
        );
        toast({
          title: "Member updated",
          description: `${member.name} has been updated successfully.`,
        });
      } else {
        const res = await api.post("/members", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMembers([...members, res.data.data]);
        toast({
          title: "Member added",
          description: `${member.name} has been added successfully.`,
        });
      }

      setEditingMember(null);
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Delete member
  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    try {
      await api.delete(`/members/${deletingMember.id}`);
      setMembers(members.filter((m) => m.id !== deletingMember.id));
      toast({
        title: "Member deleted",
        description: `${deletingMember.name} has been removed.`,
      });
      setDeletingMember(null);
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (member: MemberData) => {
    setEditingMember(member);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (member: MemberData) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gym members and their subscriptions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingMember(null);
            setIsFormModalOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 opacity-0 animate-fade-in">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedPlan}>
            <SelectTrigger className="w-[140px] bg-card">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {plans.map((plan)=>(
                <SelectItem key={plan.id} value={String(plan.id)}>{plan.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <div className="stat-card card-glow overflow-hidden opacity-0 animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Member
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Join Date
                </th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-border">
                        <AvatarImage src={member.photo || undefined} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" /> {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" /> {member.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground">
                      {member.plan || "None"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {member.join_date}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(member)}
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
                            onClick={() => openEditModal(member)}
                          >
                            Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast({
                                title: "Message sent",
                                description: `Email sent to ${member.email}`,
                              })
                            }
                          >
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteModal(member)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
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

      {/* Modals */}
      <MemberFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        member={editingMember}
        onSave={handleSaveMember}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Member"
        description={`Are you sure you want to delete ${deletingMember?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteMember}
      />
    </DashboardLayout>
  );
};

export default Members;
