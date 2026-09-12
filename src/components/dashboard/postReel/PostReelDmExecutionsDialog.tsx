import { useState, useEffect } from "react";
import { History, Loader2, CheckCircle2, AlertCircle, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { postReelDmService } from "@/services";
import { formatDate } from "@/utils";
import type { PostReelDmExecutionLog } from "@/types";

export interface PostReelDmExecutionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automationId: string | null;
  automationName?: string;
}

export function PostReelDmExecutionsDialog({
  isOpen,
  onClose,
  automationId,
  automationName,
}: PostReelDmExecutionsDialogProps) {
  const [logs, setLogs] = useState<PostReelDmExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && automationId) {
      setLoading(true);
      postReelDmService
        .getExecutions(automationId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setLogs(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to load execution logs:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, automationId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={true} className="max-w-3xl p-6 rounded-3xl border shadow-2xl bg-card">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <History className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Conversation Execution Audit Logs
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Audit history of triggers, timestamps, and delivery states for{" "}
            <span className="font-semibold text-foreground">{automationName || "this automation"}</span>.
          </DialogDescription>
        </div>

        <div className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="size-8 text-pink-500 animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">Loading execution logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl border border-border/70 bg-card/60 hover:bg-muted/20 transition-colors space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0">
                        <User className="size-3.5" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">
                        @{log.instagramUsername || "unknown"}
                      </span>
                      <Badge
                        variant={
                          log.state === "COMPLETED"
                            ? "default"
                            : log.state === "INITIAL_DM_SENT"
                            ? "secondary"
                            : log.state === "DUPLICATE"
                            ? "outline"
                            : "destructive"
                        }
                        className={`text-[10px] font-semibold uppercase py-0.5 px-2 ${
                          log.state === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : log.state === "INITIAL_DM_SENT"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : log.state === "DUPLICATE"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : ""
                        }`}
                      >
                        {log.state === "COMPLETED" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Completed
                          </span>
                        ) : log.state === "INITIAL_DM_SENT" ? (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> Initial DM Sent
                          </span>
                        ) : (
                          log.state
                        )}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="size-3" />
                      <span>Triggered: {formatDate(log.createdAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-muted/40 p-2.5 rounded-xl border border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Stage 1 Sent</span>
                      <span className="font-semibold text-foreground">
                        {log.initialSentAt ? formatDate(log.initialSentAt) : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">CTA Tap</span>
                      <span className="font-semibold text-foreground">
                        {log.ctaClickedAt ? formatDate(log.ctaClickedAt) : "Pending"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Stage 2 Primary DM</span>
                      <span className="font-semibold text-foreground">
                        {log.primarySentAt ? formatDate(log.primarySentAt) : "—"}
                      </span>
                    </div>
                  </div>

                  {log.errorMessage && (
                    <div className="flex items-start gap-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded-xl border border-destructive/20">
                      <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                      <span>{log.errorMessage}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground text-xs space-y-1">
              <History className="size-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="font-medium text-foreground">No execution events recorded yet.</p>
              <p>When users share this Post/Reel in DM, execution audit traces will appear here.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
