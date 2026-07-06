import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { HelpCircle, Plus, Search, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supportService } from "@/services";
import { MOCK_SUPPORT_TICKETS } from "@/constants/mockData";
import { formatDate } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/types";

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

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      showToast("Subject and message are required", "error");
      return;
    }
    setIsSubmitting(true);
    const r = await supportService.createTicket({ subject: form.subject, message: form.message, priority: form.priority as SupportTicket["priority"] });
    setTickets((prev) => [r.data, ...prev]);
    setShowCreate(false);
    setForm({ subject: "", message: "", priority: "medium" });
    showToast("Support ticket created!", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-muted-foreground text-sm mt-1">Get help and track your support tickets</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-brand text-white border-0 hover:opacity-90">
          <Plus className="size-4 mr-2" />New Ticket
        </Button>
      </div>

      {/* Quick help cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, title: "Live Chat", desc: "Available Mon-Fri 9am-6pm EST", action: "Start Chat" },
          { icon: HelpCircle, title: "Help Center", desc: "Browse 200+ articles and guides", action: "Browse Docs" },
          { icon: AlertCircle, title: "System Status", desc: "All systems operational", action: "View Status" },
        ].map(({ icon: Icon, title, desc, action }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border bg-card p-5 flex items-start gap-4"
          >
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="size-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">{title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 mb-2">{desc}</div>
              <Button variant="outline" size="sm" className="h-7 text-xs">{action}</Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tickets */}
      <div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
        </div>

        <div className="space-y-3">
          {filtered.map((ticket, i) => {
            const statusCfg = STATUS_CONFIG[ticket.status];
            const StatusIcon = statusCfg.icon;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border bg-card p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-semibold text-sm">{ticket.subject}</span>
                      <Badge className={cn("text-xs border flex items-center gap-1", statusCfg.className)}>
                        <StatusIcon className="size-3" />{statusCfg.label}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs border capitalize", PRIORITY_COLORS[ticket.priority])}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
                      <span>Ticket #{ticket.id}</span>
                      <span>Created {formatDate(ticket.createdAt)}</span>
                      <span>Updated {formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">View Details</Button>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <HelpCircle className="size-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No tickets found</p>
              <p className="text-sm mt-1">Create a new support ticket to get help</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Brief description of your issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low — General question</SelectItem>
                  <SelectItem value="medium">Medium — Feature not working</SelectItem>
                  <SelectItem value="high">High — Account or billing issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea rows={5} placeholder="Describe your issue in detail. Include any error messages you're seeing..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting} className="gradient-brand text-white border-0 hover:opacity-90">
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
