import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Mail, Phone, Edit, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberFormModal, MemberData } from "@/components/modals/MemberFormModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

const initialMembers: MemberData[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 234 567 890",
    plan: "Premium",
    status: "active",
    joinDate: "Jan 15, 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 234 567 891",
    plan: "Basic",
    status: "active",
    joinDate: "Feb 3, 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 234 567 892",
    plan: "Premium",
    status: "expired",
    joinDate: "Nov 20, 2023",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "David Park",
    email: "d.park@email.com",
    phone: "+1 234 567 893",
    plan: "Gold",
    status: "active",
    joinDate: "Mar 8, 2024",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Jessica Williams",
    email: "j.williams@email.com",
    phone: "+1 234 567 894",
    plan: "Basic",
    status: "pending",
    joinDate: "Mar 12, 2024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: 6,
    name: "Ryan Thompson",
    email: "r.thompson@email.com",
    phone: "+1 234 567 895",
    plan: "Premium",
    status: "active",
    joinDate: "Feb 28, 2024",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  },
];

const Members = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<MemberData[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberData | null>(null);
  const [deletingMember, setDeletingMember] = useState<MemberData | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMember = (member: MemberData) => {
    if (editingMember) {
      setMembers(members.map((m) => (m.id === member.id ? member : m)));
      toast({ title: "Member updated", description: `${member.name} has been updated successfully.` });
    } else {
      setMembers([...members, member]);
      toast({ title: "Member added", description: `${member.name} has been added successfully.` });
    }
    setEditingMember(null);
  };

  const handleDeleteMember = () => {
    if (deletingMember) {
      setMembers(members.filter((m) => m.id !== deletingMember.id));
      toast({ title: "Member deleted", description: `${deletingMember.name} has been removed.` });
      setDeletingMember(null);
      setIsDeleteModalOpen(false);
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
          onClick={() => { setEditingMember(null); setIsFormModalOpen(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Form Modal */}
      <MemberFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        member={editingMember}
        onSave={handleSaveMember}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Member"
        description={`Are you sure you want to delete ${deletingMember?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteMember}
      />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
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
          <Select>
            <SelectTrigger className="w-[140px] bg-card">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px] bg-card">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <div className="stat-card card-glow overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
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
                  Status
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
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(index + 3) * 50}ms` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-border">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground">
                      {member.plan}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge variant={member.status}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </StatusBadge>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {member.joinDate}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(member)}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(member)}>
                            Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Message sent", description: `Email sent to ${member.email}` })}>
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteModal(member)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Members;
