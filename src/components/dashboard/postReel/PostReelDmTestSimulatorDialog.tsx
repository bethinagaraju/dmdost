import { useState } from "react";
import { Play, Sparkles, CheckCircle2, Clock, Link as LinkIcon, Loader2, Video, MousePointerClick } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { postReelDmService } from "@/services";
import { showToast } from "@/hooks";
import type { PostReelDmSimulationResult } from "@/types";

export interface PostReelDmTestSimulatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automationId: string | null;
  automationName?: string;
}

export function PostReelDmTestSimulatorDialog({
  isOpen,
  onClose,
  automationId,
  automationName,
}: PostReelDmTestSimulatorDialogProps) {
  const [username, setUsername] = useState("sarah_designer");
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<PostReelDmSimulationResult | null>(null);
  const [stage2Clicked, setStage2Clicked] = useState(false);

  const handleRunSimulation = async () => {
    if (!automationId) return;
    setIsRunning(true);
    setSimulationResult(null);
    setStage2Clicked(false);
    try {
      const res = await postReelDmService.testSimulation(
        automationId,
        username.trim() || "sarah_designer"
      );
      if (res.success && res.data) {
        setSimulationResult(res.data);
        showToast("Simulation completed successfully!", "success");
      }
    } catch (err: any) {
      console.error("Simulation test error:", err);
      showToast(err.message || "Failed to execute simulation test", "error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={true} className="max-w-xl p-6 rounded-3xl border shadow-2xl bg-card">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Play className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Post/Reel DM Simulation & Preview
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Test and simulate 2-stage execution, variable substitution, delays, and CTA link delivery for{" "}
            <span className="font-semibold text-foreground">{automationName || "this automation"}</span>.
          </DialogDescription>
        </div>

        {/* Inputs */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-muted-foreground">Simulated Instagram Username</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. sarah_designer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl h-10 text-sm"
              />
              <Button
                type="button"
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="h-10 px-5 rounded-xl gap-1.5 font-semibold shrink-0 bg-pink-600 hover:bg-pink-700 text-white"
              >
                {isRunning ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Play className="size-4" /> Run Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Live Chat View */}
        {simulationResult && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-pink-500" />
                Interactive Simulation Result
              </span>
              <div className="flex items-center gap-2">
                {simulationResult.withinBusinessHours && (
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    <CheckCircle2 className="size-3 mr-1" /> Within Hours
                  </Badge>
                )}
                {simulationResult.mediaMatched && (
                  <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                    <Video className="size-3 mr-1" /> Media Matched
                  </Badge>
                )}
              </div>
            </div>

            {/* Chat Box Container */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-4 max-h-[380px] overflow-y-auto">
              {/* User shares Reel */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-xs bg-muted border border-border p-3 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Video className="size-3.5 text-pink-500" />
                    <span>@{simulationResult.simulatedUsername}</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-background/60 p-2 rounded-xl border border-border/40">
                    <p className="font-medium text-foreground">Shared your Post or Reel</p>
                    <p className="text-[10px] text-muted-foreground truncate">Media ID: {simulationResult.mediaId}</p>
                  </div>
                </div>
              </div>

              {/* Stage 1: Initial DM */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] text-muted-foreground font-medium ml-2 flex items-center gap-1">
                  <Clock className="size-3 text-pink-500" /> Stage 1: Dispatched after {simulationResult.initialDelaySeconds}s delay
                </span>
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-primary text-primary-foreground p-3.5 space-y-2 shadow-xs">
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{simulationResult.renderedInitialMessage}</p>
                  {simulationResult.ctaButtonText && (
                    <button
                      type="button"
                      onClick={() => setStage2Clicked(true)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                        stage2Clicked
                          ? "bg-emerald-500 text-white"
                          : "bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {stage2Clicked ? (
                        <>
                          <CheckCircle2 className="size-3.5" /> {simulationResult.ctaButtonText} (Tapped)
                        </>
                      ) : (
                        <>
                          <MousePointerClick className="size-3.5 text-pink-500" /> {simulationResult.ctaButtonText}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Stage 2: Primary DM (Triggered upon button click or preview) */}
              {stage2Clicked ? (
                <div className="flex flex-col items-start gap-1 animate-in fade-in-50 duration-300">
                  <span className="text-[10px] text-muted-foreground font-medium ml-2 flex items-center gap-1">
                    <Clock className="size-3 text-emerald-500" /> Stage 2: Sent after {simulationResult.primaryDelaySeconds}s delay
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-emerald-600 text-white p-3.5 space-y-2 shadow-xs">
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{simulationResult.renderedPrimaryMessage}</p>
                    {simulationResult.primaryButtonEnabled && simulationResult.primaryButtonUrl && (
                      <a
                        href={simulationResult.primaryButtonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <LinkIcon className="size-3.5" />
                        {simulationResult.primaryButtonText || "View Link"}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-[11px] text-muted-foreground italic flex items-center justify-center gap-1">
                    <MousePointerClick className="size-3" /> Tap the CTA button above to simulate Stage 2 delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
