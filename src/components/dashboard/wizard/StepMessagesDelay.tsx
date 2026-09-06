import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Clock, Shuffle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepMessagesDelayProps {
  delayType: "FIXED" | "RANDOM";
  setDelayType: (type: "FIXED" | "RANDOM") => void;
  delayValue: number;
  setDelayValue: (val: number) => void;
  delayUnit: "second" | "minute" | "hour";
  setDelayUnit: (unit: "second" | "minute" | "hour") => void;
  followRequired: boolean;
  setFollowRequired: (follow: boolean) => void;
  dmType: "text_button" | "text_only";
  setDmType: (type: "text_button" | "text_only") => void;
  optInMessage: string;
  setOptInMessage: (message: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (message: string) => void;
  buttonText: string;
  setButtonText: (text: string) => void;
  buttonUrl: string;
  setButtonUrl: (url: string) => void;
  followGateMessage: string;
  setFollowGateMessage: (message: string) => void;
}

export function StepMessagesDelay({
  delayType,
  setDelayType,
  delayValue,
  setDelayValue,
  delayUnit,
  setDelayUnit,
  followRequired,
  setFollowRequired,
  dmType,
  setDmType,
  optInMessage,
  setOptInMessage,
  welcomeMessage,
  setWelcomeMessage,
  buttonText,
  setButtonText,
  buttonUrl,
  setButtonUrl,
  followGateMessage,
  setFollowGateMessage,
}: StepMessagesDelayProps) {
  const quickPresets = [
    { label: "Instant (0s)", value: 0, unit: "second" as const },
    { label: "5s", value: 5, unit: "second" as const },
    { label: "15s", value: 15, unit: "second" as const },
    { label: "30s", value: 30, unit: "second" as const },
    { label: "1m", value: 1, unit: "minute" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Set a time delay */}
      <div className="space-y-4 rounded-2xl border border-border/80 bg-muted/10 p-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Response Delay Configuration
          </Label>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {delayValue === 0 ? "Instant Reply" : `${delayType === "RANDOM" ? "Random" : "Fixed"} ${delayValue} ${delayUnit}(s)`}
          </span>
        </div>

        {/* Delay Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDelayType("FIXED")}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
              delayType === "FIXED"
                ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-xs"
                : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:bg-muted/30"
            )}
          >
            <div className={cn(
              "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              delayType === "FIXED" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Clock className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Fixed Delay</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Waits for exact duration before triggering.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDelayType("RANDOM")}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
              delayType === "RANDOM"
                ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-xs"
                : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:bg-muted/30"
            )}
          >
            <div className={cn(
              "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              delayType === "RANDOM" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Shuffle className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Random Delay</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Waits between 1s and max delay (human-like).
              </div>
            </div>
          </button>
        </div>

        {/* Delay Value and Unit */}
        <div className="space-y-2 pt-1">
          <Label className="text-xs font-semibold text-muted-foreground">
            {delayType === "RANDOM" ? "Maximum Delay Duration (Set 0 for instant)" : "Delay Duration (Set 0 for instant)"}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              max={3600}
              value={delayValue}
              onChange={(e) => setDelayValue(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="rounded-xl h-10 w-36"
            />
            <Select value={delayUnit} onValueChange={(val: any) => setDelayUnit(val)}>
              <SelectTrigger className="w-36 h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="second">Seconds</SelectItem>
                <SelectItem value="minute">Minutes</SelectItem>
                <SelectItem value="hour">Hours</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick preset buttons */}
            <div className="hidden sm:flex items-center gap-1.5 ml-auto">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setDelayValue(preset.value);
                    setDelayUnit(preset.unit);
                  }}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg border transition-colors",
                    delayValue === preset.value && delayUnit === preset.unit
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Helper Note */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 rounded-xl p-2.5 border border-border/50">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {delayValue === 0 ? (
              <span>Replies & DMs will be sent <strong>instantly</strong> when triggered.</span>
            ) : delayType === "RANDOM" ? (
              <span>
                We'll wait a <strong>random time between 1 second and {delayValue} {delayUnit}(s)</strong> before sending replies or DMs to mimic human activity.
              </span>
            ) : (
              <span>
                We'll wait <strong>exactly {delayValue} {delayUnit}(s)</strong> after trigger before sending replies or DMs.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Opt-in Message Content */}
      <div className="space-y-3 pt-2 border-t border-border/50">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          First Message (Opt-in DM)
        </span>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">Opt-in Message Content</Label>
          <Textarea
            placeholder="e.g., Hey! Tap below and I will send you the access."
            value={optInMessage}
            onChange={(e) => setOptInMessage(e.target.value)}
            rows={3}
            className="rounded-xl resize-none text-sm"
          />
          <p className="text-[10px] text-muted-foreground leading-normal">
            This is the first message sent to the user's DM with a button to claim access.
          </p>
        </div>
      </div>

      {/* Action toggles */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Before you send your primary DM, send them...
        </span>
        <div className="space-y-2">
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-muted/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">a DM asking to follow you</span>
              <Switch
                checked={followRequired}
                onCheckedChange={setFollowRequired}
              />
            </div>
            {followRequired && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label className="text-xs font-semibold text-muted-foreground">Follow Gate Message</Label>
                <Textarea
                  placeholder="Hey there! Please follow us to unlock this content!"
                  value={followGateMessage}
                  onChange={(e) => setFollowGateMessage(e.target.value)}
                  rows={2}
                  className="rounded-xl resize-none text-sm"
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5 opacity-60">
            <span className="text-sm font-medium text-foreground">a DM asking to share their email</span>
            <Switch disabled checked={false} />
          </div>
        </div>
      </div>

      {/* Send Primary DM */}
      <div className="space-y-4 pt-2 border-t border-border/50">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Then send the primary DM...
        </span>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">DM Type</Label>
          <Select
            value={dmType}
            onValueChange={(val: any) => setDmType(val)}
          >
            <SelectTrigger className="w-full h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text_button">Text + Button</SelectItem>
              <SelectItem value="text_only">Text Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">DM Content</Label>
          <Textarea
            placeholder="Write the message you want to auto-send..."
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            rows={4}
            className="rounded-xl resize-none text-sm"
          />
        </div>

        {dmType === "text_button" && (
          <div className="p-4 rounded-xl border border-border bg-muted/5 space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Button Configuration
            </span>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Button Text</Label>
                <Input
                  placeholder="e.g., View Details"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Button Link URL</Label>
                <Input
                  placeholder="https://example.com/details"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
