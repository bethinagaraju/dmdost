import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Palette, Trash2, Camera, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { userService } from "@/services";
import { MOCK_USER } from "@/constants/mockData";
import { showToast } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const currentUser = user ?? MOCK_USER;

  const [profile, setProfile] = useState({ name: currentUser.name, email: currentUser.email, bio: "Building @InstaAutoDM. Passionate about automation and growth.", timezone: "America/New_York" });
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [notifications, setNotifications] = useState({
    emailAutomations: true,
    emailMessages: false,
    emailBilling: true,
    pushAll: true,
    pushMessages: true,
    weeklyReport: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await userService.updateProfile(profile);
    showToast("Profile updated!", "success");
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.newPw || !passwords.confirm) {
      showToast("All fields required", "error");
      return;
    }
    if (passwords.newPw !== passwords.confirm) {
      showToast("Passwords don't match", "error");
      return;
    }
    if (passwords.newPw.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    setIsSaving(true);
    await userService.changePassword(passwords.current, passwords.newPw);
    setPasswords({ current: "", newPw: "", confirm: "" });
    showToast("Password changed successfully!", "success");
    setIsSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== currentUser.email) {
      showToast("Email doesn't match", "error");
      return;
    }
    await userService.deleteAccount();
    showToast("Account deletion requested", "info");
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile"><User className="size-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="security"><Lock className="size-4 mr-2" />Security</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="size-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="preferences"><Palette className="size-4 mr-2" />Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 space-y-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="size-20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
                  <Camera className="size-3.5" />
                </button>
              </div>
              <div>
                <div className="font-semibold text-lg">{currentUser.name}</div>
                <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                <div className="text-xs text-muted-foreground capitalize mt-0.5">{currentUser.plan} Plan</div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself..." />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving} className="gradient-brand text-white border-0 hover:opacity-90">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 space-y-5">
            <h3 className="font-semibold">Change Password</h3>
            <div className="space-y-4">
              {[
                { key: "current" as const, label: "Current Password", placeholder: "Enter current password" },
                { key: "newPw" as const, label: "New Password", placeholder: "Min. 8 characters" },
                { key: "confirm" as const, label: "Confirm New Password", placeholder: "Repeat new password" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="relative">
                    <Input
                      type={showPw[key] ? "text" : "password"}
                      placeholder={placeholder}
                      value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw[key] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={isSaving} className="gradient-brand text-white border-0 hover:opacity-90">
                Update Password
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mt-1">Delete your account and all associated data permanently.</p>
              </div>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="size-4 mr-2" />Delete Account
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: "emailAutomations" as const, label: "Automation alerts", description: "Get notified when automations trigger or fail" },
                  { key: "emailMessages" as const, label: "New messages", description: "Email when you receive new DMs" },
                  { key: "emailBilling" as const, label: "Billing & invoices", description: "Receipts and billing notifications" },
                  { key: "weeklyReport" as const, label: "Weekly report", description: "Summary of your weekly performance" },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                    <Switch checked={notifications[key]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: "pushAll" as const, label: "All notifications", description: "Enable all push notifications" },
                  { key: "pushMessages" as const, label: "Messages only", description: "Only notify for new messages" },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                    <Switch checked={notifications[key]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => showToast("Notification preferences saved!", "success")} className="gradient-brand text-white border-0 hover:opacity-90">
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 space-y-5">
            <h3 className="font-semibold">App Preferences</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <div>
                  <div className="font-medium text-sm">Compact Mode</div>
                  <div className="text-xs text-muted-foreground">Reduce spacing and card sizes for more content</div>
                </div>
                <Switch />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => showToast("Preferences saved!", "success")} className="gradient-brand text-white border-0 hover:opacity-90">
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>This action cannot be undone. All your data, automations, and accounts will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Type your email to confirm: <strong>{currentUser.email}</strong></Label>
            <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={currentUser.email} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteConfirm !== currentUser.email}>Delete Forever</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
