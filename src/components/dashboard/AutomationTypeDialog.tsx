import { MessageCircle, MessageSquare, Zap, ArrowRight, ShieldCheck, Clock, Layers, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export interface AutomationTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: "COMMENT_TO_DM" | "DM_AUTOMATION" | "POST_REEL_DM") => void;
}

export function AutomationTypeDialog({
  isOpen,
  onClose,
  onSelectType,
}: AutomationTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={true} className="max-w-xl p-6 rounded-3xl border shadow-2xl bg-card">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="size-4" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Create New Automation
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose what type of Instagram automation workflow you want to build.
          </DialogDescription>
        </div>

        <div className="grid grid-cols-1 gap-3.5 pt-3">
          {/* Option 1: Comment-to-DM */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectType("COMMENT_TO_DM");
            }}
            className="group relative flex flex-col p-4.5 rounded-2xl border border-border bg-card/60 hover:bg-muted/30 hover:border-primary/50 text-left transition-all hover:shadow-md ring-1 ring-transparent hover:ring-primary/20 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      Comment-to-DM Trigger
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-0">
                      Post & Reels
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Triggered when someone comments on your specific Posts or Reels.
                  </p>
                </div>
              </div>
              <div className="size-8 rounded-full bg-muted/50 group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="size-4" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-500" /> Follow Gate
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-blue-500" /> Response Delay
              </span>
              <span>•</span>
              <span>Auto Comment Reply</span>
            </div>
          </button>

          {/* Option 2: Direct Message (DM) Automation */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectType("DM_AUTOMATION");
            }}
            className="group relative flex flex-col p-4.5 rounded-2xl border border-border bg-card/60 hover:bg-muted/30 hover:border-primary/50 text-left transition-all hover:shadow-md ring-1 ring-transparent hover:ring-primary/20 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      Direct Message (DM) Automation
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0">
                      Inbox Engine
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Triggered when an Instagram user sends a DM matching your keywords or conditions.
                  </p>
                </div>
              </div>
              <div className="size-8 rounded-full bg-muted/50 group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="size-4" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="size-3 text-indigo-500" /> Multi-Step Sequences
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-amber-500" /> Business Hours
              </span>
              <span>•</span>
              <span>Anti-Spam Cooldown</span>
            </div>
          </button>

          {/* Option 3: DMs your Post or Reel Trigger */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectType("POST_REEL_DM");
            }}
            className="group relative flex flex-col p-4.5 rounded-2xl border border-border bg-card/60 hover:bg-muted/30 hover:border-pink-500/50 text-left transition-all hover:shadow-md ring-1 ring-transparent hover:ring-pink-500/20 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Video className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      DMs your Post or Reel Trigger
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-pink-500/10 text-pink-600 dark:text-pink-400 border-0">
                      Share to DM
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Triggered when an Instagram user shares your specific Post or Reel into your DMs.
                  </p>
                </div>
              </div>
              <div className="size-8 rounded-full bg-muted/50 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="size-4" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="size-3 text-pink-500" /> 2-Stage Lifecycle
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-pink-500" /> Dual Configurable Delays
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-500" /> Deduplication Guard
              </span>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

