import { useState } from "react";
import { Play, Sparkles, CheckCircle2, XCircle, Clock, Link as LinkIcon, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { dmAutomationService } from "@/services";
import { showToast } from "@/hooks";
import type { DmSimulationResult } from "@/types";

export interface DmTestSimulatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automationId: string | null;
  automationName?: string;
}

export function DmTestSimulatorDialog({
  isOpen,
  onClose,
  automationId,
  automationName,
}: DmTestSimulatorDialogProps) {
  const [username, setUsername] = useState("alex_dev");
  const [messageText, setMessageText] = useState("Can you send price?");
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DmSimulationResult | null>(null);

  const handleRunSimulation = async () => {
    if (!automationId) return;
    if (!messageText.trim()) {
      showToast("Please enter a simulated incoming message", "error");
      return;
    }

    setIsRunning(true);
    setSimulationResult(null);
    try {
      const res = await dmAutomationService.testSimulation(
        automationId,
        messageText.trim(),
        username.trim() || "instagram_user"
      );
      if (res.success && res.data) {
        setSimulationResult(res.data);
        showToast("Simulation test completed!", "success");
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
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Play className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Simulation Test & Preview
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Test and simulate keyword matching, variable substitution, and message step delivery for{" "}
            <span className="font-semibold text-foreground">{automationName || "this automation"}</span>.
          </DialogDescription>
        </div>

        {/* Inputs */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Simulated Username</Label>
              <Input
                placeholder="e.g. alex_dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Simulated Incoming DM</Label>
              <Input
                placeholder="e.g. Can you send price?"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="rounded-xl h-10 text-sm"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleRunSimulation}
            disabled={isRunning || !automationId}
            className="w-full gradient-brand text-white border-0 hover:opacity-90 rounded-xl h-10 text-sm font-medium"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Simulating Trigger...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="size-4" /> Run Simulation Test
              </span>
            )}
          </Button>
        </div>

        {/* Simulation Output */}
        {simulationResult && (
          <div className="space-y-4 pt-4 border-t border-border mt-2 animate-in fade-in duration-300">
            {/* Match Status Card */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/20">
              <div className="flex items-center gap-2.5">
                {simulationResult.matched ? (
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-5 text-destructive shrink-0" />
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {simulationResult.matched ? "Trigger Matched Successfully" : "No Trigger Match"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {simulationResult.matched
                      ? "The incoming DM satisfied all trigger and keyword matching rules."
                      : "The message didn't match configured keywords or conditions."}
                  </div>
                </div>
              </div>
              <Badge
                variant={simulationResult.matched ? "default" : "destructive"}
                className="text-xs px-2.5 py-0.5 rounded-md"
              >
                {simulationResult.matched ? "MATCHED" : "UNMATCHED"}
              </Badge>
            </div>

            {/* Simulated Steps Delivery Preview */}
            {simulationResult.matched && simulationResult.simulatedSteps && (
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Rendered Sequence Output
                </Label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {simulationResult.simulatedSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pb-1.5 border-b border-border/40">
                        <span className="font-semibold text-foreground">Step {step.stepOrder}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {step.delaySeconds === 0 ? "Immediate" : `Delay: ${step.delaySeconds}s`}
                        </span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">
                        {step.messageText}
                      </p>
                      {step.buttonEnabled && step.buttonText && (
                        <div className="pt-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                            <LinkIcon className="size-3" />
                            {step.buttonText}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
