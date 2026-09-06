import { useState, useEffect } from "react";
import { History, Loader2, CheckCircle2, Clock, AlertTriangle, XCircle, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { dmAutomationService } from "@/services";
import { formatDate } from "@/utils";
import type { DmExecutionLog } from "@/types";

export interface DmExecutionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automationId: string | null;
  automationName?: string;
}

export function DmExecutionsDialog({
  isOpen,
  onClose,
  automationId,
  automationName,
}: DmExecutionsDialogProps) {
  const [logs, setLogs] = useState<DmExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && automationId) {
      setLoading(true);
      dmAutomationService
        .getExecutions(automationId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setLogs(res.data);
          } else {
            setLogs([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load executions:", err);
          setLogs([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, automationId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]">
            <CheckCircle2 className="size-3 mr-1" /> Success
          </Badge>
        );
      case "DUPLICATE":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px]">
            <Clock className="size-3 mr-1" /> Cooldown Skipped
          </Badge>
        );
      case "SKIPPED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[11px]">
            <AlertTriangle className="size-3 mr-1" /> Follow Gate Prompted
          </Badge>
        );
      case "FAILED":
      default:
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[11px]">
            <XCircle className="size-3 mr-1" /> Failed
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={true} className="max-w-2xl p-6 rounded-3xl border shadow-2xl bg-card">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <History className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Automation Execution Logs
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Audit history of real-time incoming messages and automated triggers for{" "}
            <span className="font-semibold text-foreground">{automationName || "this automation"}</span>.
          </DialogDescription>
        </div>

        <div className="pt-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">Loading execution logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-muted/10 space-y-2">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <MessageSquare className="size-5" />
              </div>
              <p className="text-sm font-medium text-foreground">No execution logs yet</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Trigger events will appear here when users send incoming direct messages.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl border border-border bg-card/60 hover:bg-muted/20 transition-colors space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        @{log.instagramUsername || "user"}
                      </span>
                      {log.matchedKeyword && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                          kw: {log.matchedKeyword}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(log.status)}
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(log.executedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs bg-muted/40 rounded-xl p-2.5 font-mono text-muted-foreground break-words">
                    "{log.incomingMessageText}"
                  </div>

                  {log.errorMessage && (
                    <div className="text-[11px] text-destructive bg-destructive/10 rounded-lg p-2">
                      {log.errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>Messages Dispatched: <strong>{log.messagesSentCount}</strong></span>
                    <span className="font-mono text-[10px]">ID: {log.id.slice(0, 8)}...</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
