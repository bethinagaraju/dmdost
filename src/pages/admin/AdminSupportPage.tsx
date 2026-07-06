import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, Clock, CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatDate } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/types";
import { MOCK_SUPPORT_TICKETS } from "@/constants/mockData";

const EXTRA_TICKETS: SupportTicket[] = [
  { id: "tkt_04", subject: "Feature request: bulk message templates", status: "open", priority: "low", createdAt: "2024-03-13T14:00:00Z", updatedAt: "2024-03-13T14:00:00Z", userId: "u2", userName: "Marcus Rivera" },
  { id: "tkt_05", subject: "API rate limit exceeded on enterprise plan", status: "in_progress", priority: "high", createdAt: "2024-03-12T09:00:00Z", updatedAt: "2024-03-14T16:00:00Z", userId: "u3", userName: "Priya Sharma" },
];

const STATUS_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  open: { label: "Open", icon: AlertCircle, className: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" },
  in_progress: { label: "In Progress", icon: Clock, className: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800" },
  resolved: { label: "Resolved", icon: CheckCircle, className: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" },
  closed: { label: "Closed", icon: CheckCircle, className: "text-muted-foreground bg-muted border-border" },
};

const PRIORITY_COLORS = {
  low: "text-muted-foreground bg-muted border-border",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  high: "text-destructive bg-destructive/10 border-destructive/20",
};

const AVATARS: Record<string, string> = {
  usr_01: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  u2: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
  u3: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([...MOCK_SUPPORT_TICKETS, ...EXTRA_TICKETS]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.userName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  const handleResolve = (id: string) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: "resolved" as const } : t));
    showToast("Ticket marked as resolved", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and respond to customer support requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Open Tickets" value={stats.open} icon={<AlertCircle />} changeType="neutral" change="Need attention" />
        <StatCard title="In Progress" value={stats.in_progress} icon={<Clock />} changeType="neutral" change="Being handled" />
        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} changeType="positive" change="Closed tickets" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search tickets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((ticket, i) => {
          const statusCfg = STATUS_CONFIG[ticket.status];
          const StatusIcon = statusCfg.icon;
          return (
            <motion.div key={ticket.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-2xl border bg-card p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3 flex-wrap">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={AVATARS[ticket.userId] ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.userId}`} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">{(ticket.userName ?? "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-semibold text-sm">{ticket.subject}</span>
                    <Badge className={cn("text-xs border flex items-center gap-1", statusCfg.className)}>
                      <StatusIcon className="size-3" />{statusCfg.label}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs border capitalize", PRIORITY_COLORS[ticket.priority])}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
                    <span className="font-medium text-foreground/70">{ticket.userName}</span>
                    <span>Ticket #{ticket.id}</span>
                    <span>Created {formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 shrink-0"><MoreHorizontal className="size-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><MessageCircle className="size-4 mr-2" />Reply</DropdownMenuItem>
                    {ticket.status !== "resolved" && (
                      <DropdownMenuItem onClick={() => handleResolve(ticket.id)}>
                        <CheckCircle className="size-4 mr-2" />Mark Resolved
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
