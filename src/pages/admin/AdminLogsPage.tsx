import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Search, CheckCircle, XCircle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_ACTIVITY_LOGS } from "@/constants/mockData";
import { formatDateTime } from "@/utils";
import { cn } from "@/lib/utils";

const ALL_LOGS = [
  ...MOCK_ACTIVITY_LOGS,
  { id: "sys_01", type: "system_startup", description: "Application server restarted successfully", timestamp: "2024-03-15T08:00:00Z", status: "success" as const, metadata: { version: "2.4.1" } },
  { id: "sys_02", type: "db_backup", description: "Scheduled database backup completed", timestamp: "2024-03-15T04:00:00Z", status: "success" as const, metadata: { size: "2.4GB", duration: "3m 12s" } },
  { id: "sys_03", type: "api_error", description: "Instagram API rate limit reached for account ig_01", timestamp: "2024-03-14T22:30:00Z", status: "failed" as const, metadata: { account: "ig_01", limit: "200/hr" } },
];

const TYPE_COLORS: Record<string, string> = {
  automation_triggered: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  dm_sent: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  dm_failed: "text-destructive bg-destructive/10 border-destructive/20",
  comment_replied: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
  login: "text-muted-foreground bg-muted border-border",
  automation_created: "text-primary bg-primary/10 border-primary/20",
  subscription_updated: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  system_startup: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  db_backup: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  api_error: "text-destructive bg-destructive/10 border-destructive/20",
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = ALL_LOGS.filter((log) => {
    const matchSearch = log.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || log.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">Full audit trail of platform events</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><Filter className="size-3.5 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-3 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span className="hidden sm:block">Type</span>
          <span>Description</span>
          <span className="hidden sm:block">Status</span>
          <span>Timestamp</span>
        </div>
        <div className="divide-y">
          {filtered.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="hidden sm:block">
                <Badge variant="outline" className={cn("text-xs border whitespace-nowrap", TYPE_COLORS[log.type] ?? "")}>
                  {log.type.replace(/_/g, " ")}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium">{log.description}</div>
                {log.metadata && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <span key={key} className="text-xs text-muted-foreground">
                        <span className="font-medium">{key}:</span> {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                {log.status === "success" ? <CheckCircle className="size-4 text-green-500" /> : <XCircle className="size-4 text-destructive" />}
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(log.timestamp)}</div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Activity className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
