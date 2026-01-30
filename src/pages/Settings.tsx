import { useState, useRef } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Database, Mail, Save, Building, Upload, Key } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
  });

  const [gymSettings, setGymSettings] = useState({
    gymName: "Iron Pulse Gym",
    phone: "+1 (555) 123-4567",
    email: "contact@ironpulsegym.com",
    website: "www.ironpulsegym.com",
    address: "123 Fitness Street, Muscle City, MC 12345",
    timezone: "America/New_York (EST)",
    language: "English (US)",
    currency: "USD ($)",
    dateFormat: "MM/DD/YYYY",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // تحديث صورة البروفايل
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
        toast({
          title: "Photo updated",
          description: "Your profile photo has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ البروفايل
  const handleSaveProfile = () => {
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    });
    toast({
      title: "Profile saved",
      description: "Your profile has been updated successfully.",
    });
  };

  // حفظ إعدادات الجيم
  const handleSaveGeneral = () => {
    toast({
      title: "Settings saved",
      description: "Gym settings have been updated successfully.",
    });
  };

  // حفظ إعدادات الإشعارات
  const handleSaveNotifications = () => {
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved.",
    });
  };

  // تحديث الباسورد
  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwords.new.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setPasswords({ current: "", new: "", confirm: "" });
    toast({ title: "Password updated", description: "Your password has been changed successfully." });
  };

  if (!profile) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your gym system preferences and configurations.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-border p-1 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-card">
            <Building className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-card">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-card">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-card">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card className="stat-card opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-primary" /> Gym Information</CardTitle>
                <CardDescription>Basic information about your gym</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["gymName", "phone", "email", "website"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field === "gymName" ? "Gym Name" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        id={field}
                        value={gymSettings[field as keyof typeof gymSettings]}
                        onChange={(e) => setGymSettings({ ...gymSettings, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={gymSettings.address}
                    onChange={(e) => setGymSettings({ ...gymSettings, address: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveGeneral} className="gap-2"><Save className="w-4 h-4" /> Save Gym Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="stat-card opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Admin Profile</CardTitle>
              <CardDescription>Manage your personal account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-2 border-primary/30">
                  <AvatarImage src={profile.photo} />
                  <AvatarFallback>{profile.name}</AvatarFallback>
                </Avatar>
                <div>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <Upload className="w-4 h-4" /> Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["firstName", "lastName", "email"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{field === "email" ? "Email Address" : field === "firstName" ? "First Name" : "Last Name"}</Label>
                    <Input
                      id={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile.role} disabled />
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="gap-2"><Save className="w-4 h-4" /> Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="stat-card opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-warning" /> Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(notifications).map((key) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</p>
                    <p className="text-sm text-muted-foreground">Toggle {key} notifications</p>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                  />
                </div>
              ))}
              <Button onClick={handleSaveNotifications} className="gap-2"><Save className="w-4 h-4" /> Save Notifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="stat-card opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-success" /> Password & Authentication</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div></div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
              </div>
              <Button variant="outline" onClick={handleUpdatePassword}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
