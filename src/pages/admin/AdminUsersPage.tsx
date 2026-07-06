import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, MoreHorizontal, UserCheck, UserX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate, formatNumber, getStatusColor } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  status: "active" | "inactive" | "suspended";
  automations: number;
  messagesSent: number;
  joinedAt: string;
}

const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Jessica Thompson", email: "jessica@stylehive.co", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jess", plan: "professional", status: "active", automations: 12, messagesSent: 8420, joinedAt: "2024-01-15T10:00:00Z" },
  { id: "u2", name: "Marcus Rivera", email: "marcus@growthlab.io", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus", plan: "enterprise", status: "active", automations: 45, messagesSent: 56000, joinedAt: "2024-01-20T10:00:00Z" },
  { id: "u3", name: "Priya Sharma", email: "priya@fitwithpriya.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", plan: "starter", status: "active", automations: 5, messagesSent: 2100, joinedAt: "2024-02-01T10:00:00Z" },
  { id: "u4", name: "David Chen", email: "david@techflow.inc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david", plan: "professional", status: "inactive", automations: 8, messagesSent: 4300, joinedAt: "2024-02-10T10:00:00Z" },
  { id: "u5", name: "Sofia Martinez", email: "sofia@styleby.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia", plan: "starter", status: "active", automations: 3, messagesSent: 1800, joinedAt: "2024-02-15T10:00:00Z" },
  { id: "u6", name: "Alex Johnson", email: "alex@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", plan: "professional", status: "active", automations: 5, messagesSent: 4235, joinedAt: "2024-01-15T10:00:00Z" },
];

const PLAN_COLORS: Record<string, string> = {
  free: "text-muted-foreground bg-muted border-border",
  starter: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  professional: "text-primary bg-primary/10 border-primary/20",
  enterprise: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || u.plan === filterPlan;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleSuspend = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" as AdminUser["status"] } : u));
    showToast("User status updated", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} total registered users</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="divide-y">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <Avatar className="size-9 shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{user.name}</span>
                  <Badge variant="outline" className={cn("text-xs border capitalize", PLAN_COLORS[user.plan] ?? "")}>{user.plan}</Badge>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getStatusColor(user.status))}>{user.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{user.email} &bull; Joined {formatDate(user.joinedAt)}</div>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                <div className="text-center">
                  <div className="font-bold text-foreground">{user.automations}</div>
                  <div>Automations</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-foreground">{formatNumber(user.messagesSent)}</div>
                  <div>Messages</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 shrink-0">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Mail className="size-4 mr-2" />Send Email</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSuspend(user.id)}>
                    {user.status === "suspended" ? <><UserCheck className="size-4 mr-2" />Unsuspend</> : <><UserX className="size-4 mr-2" />Suspend</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">Delete Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
