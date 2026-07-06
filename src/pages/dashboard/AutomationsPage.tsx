import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, MoreHorizontal, Zap,
  Trash2, Copy, Edit, Play, Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { automationService } from "@/services";
import { MOCK_AUTOMATIONS } from "@/constants/mockData";
import { getStatusColor, getAutomationTypeLabel, formatDate } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Automation } from "@/types";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("keyword_dm");
  const [newTrigger, setNewTrigger] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const filtered = automations.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || a.type === filterType;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await automationService.toggle(id, newStatus as "active" | "inactive");
    setAutomations((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus as Automation["status"] } : a));
    showToast(`Automation ${newStatus}`, "success");
  };

  const handleDelete = async (id: string) => {
    await automationService.delete(id);
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    showToast("Automation deleted", "success");
  };

  const handleDuplicate = (auto: Automation) => {
    const copy: Automation = {
      ...auto,
      id: `auto_${Date.now()}`,
      name: `${auto.name} (Copy)`,
      status: "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { triggered: 0, sent: 0, failed: 0 },
    };
    setAutomations((prev) => [...prev, copy]);
    showToast("Automation duplicated", "success");
  };

  const handleCreate = async () => {
    if (!newName.trim()) { showToast("Name is required", "error"); return; }
    setIsCreating(true);
    const r = await automationService.create({ name: newName, type: newType as Automation["type"], trigger: newTrigger, template: newTemplate });
    setAutomations((prev) => [...prev, r.data]);
    setShowCreate(false);
    setNewName(""); setNewType("keyword_dm"); setNewTrigger(""); setNewTemplate("");
    showToast("Automation created!", "success");
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-muted-foreground text-sm mt-1">{automations.filter((a) => a.status === "active").length} active of {automations.length} total</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-brand text-white border-0 hover:opacity-90">
          <Plus className="size-4 mr-2" />Create Automation
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search automations..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="keyword_dm">Keyword DM</SelectItem>
            <SelectItem value="comment_reply">Comment Reply</SelectItem>
            <SelectItem value="follow_check">Follow Check</SelectItem>
            <SelectItem value="welcome_dm">Welcome DM</SelectItem>
            <SelectItem value="story_reply">Story Reply</SelectItem>
            <SelectItem value="live_reply">Live Reply</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((auto, i) => (
          <motion.div
            key={auto.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow"
          >
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="size-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold">{auto.name}</span>
                <Badge variant="outline" className="text-xs">{getAutomationTypeLabel(auto.type)}</Badge>
                <Badge className={cn("text-xs", getStatusColor(auto.status))}>{auto.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span>Triggered: {auto.stats.triggered.toLocaleString()}</span>
                <span>Sent: {auto.stats.sent.toLocaleString()}</span>
                <span>Failed: {auto.stats.failed}</span>
                <span>Updated: {formatDate(auto.updatedAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={auto.status === "active"}
                onCheckedChange={() => handleToggle(auto.id, auto.status)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit className="size-4 mr-2" />Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(auto)}><Copy className="size-4 mr-2" />Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggle(auto.id, auto.status)}>
                    {auto.status === "active" ? <><Pause className="size-4 mr-2" />Pause</> : <><Play className="size-4 mr-2" />Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete(auto.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4 mr-2" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Zap className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No automations found</p>
            <p className="text-sm">Try adjusting your filters or create a new automation</p>
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Automation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Automation Name</Label>
              <Input placeholder="e.g., Welcome New Followers" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="keyword_dm">Keyword DM</SelectItem>
                  <SelectItem value="comment_reply">Comment Reply</SelectItem>
                  <SelectItem value="follow_check">Follow Check</SelectItem>
                  <SelectItem value="welcome_dm">Welcome DM</SelectItem>
                  <SelectItem value="story_reply">Story Reply</SelectItem>
                  <SelectItem value="live_reply">Live Reply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trigger / Keyword</Label>
              <Input placeholder="e.g., discount, price, info..." value={newTrigger} onChange={(e) => setNewTrigger(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message Template</Label>
              <Textarea placeholder="Hi {{name}}! Thanks for your interest..." rows={3} value={newTemplate} onChange={(e) => setNewTemplate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating} className="gradient-brand text-white border-0 hover:opacity-90">
              {isCreating ? "Creating..." : "Create Automation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
