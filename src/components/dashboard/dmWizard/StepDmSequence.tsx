import { Plus, Trash2, Clock, Link as LinkIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { DmMessageStep } from "@/types";

export interface StepDmSequenceProps {
  steps: DmMessageStep[];
  setSteps: (steps: DmMessageStep[]) => void;
}

export function StepDmSequence({ steps, setSteps }: StepDmSequenceProps) {
  const handleAddStep = () => {
    const newStep: DmMessageStep = {
      stepOrder: steps.length + 1,
      messageText: "",
      delaySeconds: steps.length === 0 ? 0 : 2,
      buttonEnabled: false,
      buttonType: "WEB_URL",
      buttonText: "Click Here",
      buttonUrl: "https://",
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    const filtered = steps.filter((_, i) => i !== index);
    // Re-index stepOrder
    const reordered = filtered.map((s, idx) => ({
      ...s,
      stepOrder: idx + 1,
    }));
    setSteps(reordered);
  };

  const handleUpdateStep = (index: number, updates: Partial<DmMessageStep>) => {
    setSteps(
      steps.map((step, idx) => (idx === index ? { ...step, ...updates } : step))
    );
  };

  const insertVariable = (index: number, variable: string) => {
    const current = steps[index]?.messageText || "";
    handleUpdateStep(index, { messageText: current + ` {{${variable}}}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <MessageSquare className="size-4 text-primary" /> Multi-Step Message Sequence
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure the automated sequence of DMs sent to the user when triggered.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAddStep}
          size="sm"
          className="rounded-xl h-9 text-xs flex items-center gap-1.5"
        >
          <Plus className="size-3.5" /> Add Step
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs relative group"
          >
            {/* Step Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs px-2.5 py-0.5 rounded-lg font-bold">
                  Step {step.stepOrder}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3 text-primary" />
                  <span>
                    {step.delaySeconds === 0 ? "Send Immediately" : `Wait ${step.delaySeconds}s before sending`}
                  </span>
                </div>
              </div>

              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="size-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                  title="Remove Step"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>

            {/* Delay Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-1">
                <Label className="text-xs text-muted-foreground font-medium">
                  Step Delay (Seconds)
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={300}
                  value={step.delaySeconds}
                  onChange={(e) =>
                    handleUpdateStep(index, {
                      delaySeconds: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="rounded-xl h-9 text-xs mt-1"
                  placeholder="0"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-1 sm:justify-end pt-3 sm:pt-0">
                <span className="text-[11px] text-muted-foreground mr-1">Insert Variable:</span>
                {["first_name", "username", "automation_name", "link"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(index, v)}
                    className="px-2 py-1 bg-muted/60 hover:bg-muted text-[11px] font-mono rounded-lg border border-border transition-colors"
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Text */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Message Content *</Label>
              <Textarea
                rows={3}
                placeholder="Write your automated message text here..."
                value={step.messageText}
                onChange={(e) => handleUpdateStep(index, { messageText: e.target.value })}
                className="rounded-xl resize-none text-sm bg-background"
              />
            </div>

            {/* Button Option */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5 cursor-pointer">
                  <LinkIcon className="size-3.5 text-primary" /> Include Action Button
                </Label>
                <Switch
                  checked={step.buttonEnabled}
                  onCheckedChange={(checked) =>
                    handleUpdateStep(index, {
                      buttonEnabled: checked,
                      buttonType: checked ? "WEB_URL" : null,
                      buttonText: checked ? step.buttonText || "Get Access" : null,
                      buttonUrl: checked ? step.buttonUrl || "https://" : null,
                    })
                  }
                />
              </div>

              {step.buttonEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Button Title *</Label>
                    <Input
                      placeholder="e.g. Get Course / Claim Deal"
                      value={step.buttonText || ""}
                      onChange={(e) => handleUpdateStep(index, { buttonText: e.target.value })}
                      className="rounded-lg h-9 text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Button Web URL *</Label>
                    <Input
                      placeholder="https://example.com/course"
                      value={step.buttonUrl || ""}
                      onChange={(e) => handleUpdateStep(index, { buttonUrl: e.target.value })}
                      className="rounded-lg h-9 text-xs bg-background"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
