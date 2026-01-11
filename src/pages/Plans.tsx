import { useState } from "react";
import { Plus, Check, X, Edit, MoreVertical, Users, Zap, Trash2, Star } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlans, Plan, PlanFeature } from "@/contexts/PlansContext";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

const defaultFeatures: PlanFeature[] = [
  { name: "Access to gym equipment", included: false },
  { name: "Locker room access", included: false },
  { name: "Basic fitness assessment", included: false },
  { name: "Group classes", included: false },
  { name: "Personal training sessions", included: false },
  { name: "Nutrition consultation", included: false },
];

const Plans = () => {
  // Use shared PlansContext for real-time sync with Landing Page
  const { plans, addPlan, updatePlan, deletePlan, togglePlanStatus } = usePlans();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    period: "month",
    duration: 1,
    description: "",
    features: defaultFeatures.map((f) => ({ ...f })),
    popular: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      period: "month",
      duration: 1,
      description: "",
      features: defaultFeatures.map((f) => ({ ...f, included: false })),
      popular: false,
    });
    setEditingPlan(null);
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      duration: plan.duration,
      description: plan.description,
      features: plan.features.map((f) => ({ ...f })),
      popular: plan.popular,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingPlan) {
      // TODO: Backend integration - update plan via API
      updatePlan(editingPlan.id, {
        ...formData,
        status: editingPlan.status,
        activeMembers: editingPlan.activeMembers,
      });
      toast({
        title: "Plan Updated",
        description: `${formData.name} plan has been updated successfully.`,
      });
    } else {
      // TODO: Backend integration - create plan via API
      addPlan({
        ...formData,
        status: "active",
        activeMembers: 0,
      });
      toast({
        title: "Plan Created",
        description: `${formData.name} plan has been created and is now visible on the landing page.`,
      });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingPlan) {
      // TODO: Backend integration - delete plan via API
      deletePlan(deletingPlan.id);
      toast({
        title: "Plan Deleted",
        description: `${deletingPlan.name} plan has been removed from the landing page.`,
      });
      setIsDeleteOpen(false);
      setDeletingPlan(null);
    }
  };

  const handleFeatureToggle = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures[index].included = !newFeatures[index].included;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleToggleStatus = (plan: Plan) => {
    togglePlanStatus(plan.id);
    toast({
      title: "Status Updated",
      description: `${plan.name} is now ${plan.status === "active" ? "inactive" : "active"}. ${
        plan.status === "active" 
          ? "It will no longer appear on the landing page." 
          : "It is now visible on the landing page."
      }`,
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Membership Plans</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage membership plans for your gym
          </p>
        </div>
        <Button 
          onClick={openAddForm}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`stat-card card-glow relative opacity-0 animate-fade-in ${
              plan.popular ? "ring-2 ring-primary" : ""
            } ${plan.status === "inactive" ? "opacity-60" : ""}`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditForm(plan)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="w-4 h-4 mr-2" />
                    View Members
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setDeletingPlan(plan);
                      setIsDeleteOpen(true);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Plan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground glow-text">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  {feature.included ? (
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <span
                    className={`text-sm ${
                      feature.included ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{plan.activeMembers} members</span>
                </div>
                <StatusBadge variant={plan.status === "active" ? "active" : "inactive"}>
                  {plan.status === "active" ? "Active" : "Inactive"}
                </StatusBadge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan Status</span>
                <Switch
                  checked={plan.status === "active"}
                  onCheckedChange={() => handleToggleStatus(plan)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this plan..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="space-y-2 border border-border rounded-md p-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={feature.included}
                      onCheckedChange={() => handleFeatureToggle(index)}
                    />
                    <span className="text-sm">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.popular}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, popular: !!checked })
                }
              />
              <Label className="cursor-pointer flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Mark as Most Popular
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Plan"
        description={`Are you sure you want to delete the "${deletingPlan?.name}" plan? This will also remove it from the landing page. This action cannot be undone.`}
      />
    </DashboardLayout>
  );
};

export default Plans;
