import { Clock, ShieldAlert, Calendar, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface StepDmSettingsProps {
  businessHoursEnabled: boolean;
  setBusinessHoursEnabled: (enabled: boolean) => void;
  businessStartTime: string;
  setBusinessStartTime: (time: string) => void;
  businessEndTime: string;
  setBusinessEndTime: (time: string) => void;
  businessDays: string[];
  setBusinessDays: (days: string[]) => void;
  offlineMessage: string;
  setOfflineMessage: (msg: string) => void;
  deduplicationEnabled: boolean;
  setDeduplicationEnabled: (enabled: boolean) => void;
  deduplicationHours: number;
  setDeduplicationHours: (hours: number) => void;
}

const ALL_DAYS = [
  { id: "MONDAY", label: "Mon" },
  { id: "TUESDAY", label: "Tue" },
  { id: "WEDNESDAY", label: "Wed" },
  { id: "THURSDAY", label: "Thu" },
  { id: "FRIDAY", label: "Fri" },
  { id: "SATURDAY", label: "Sat" },
  { id: "SUNDAY", label: "Sun" },
];

export function StepDmSettings({
  businessHoursEnabled,
  setBusinessHoursEnabled,
  businessStartTime,
  setBusinessStartTime,
  businessEndTime,
  setBusinessEndTime,
  businessDays,
  setBusinessDays,
  offlineMessage,
  setOfflineMessage,
  deduplicationEnabled,
  setDeduplicationEnabled,
  deduplicationHours,
  setDeduplicationHours,
}: StepDmSettingsProps) {
  const toggleDay = (dayId: string) => {
    if (businessDays.includes(dayId)) {
      setBusinessDays(businessDays.filter((d) => d !== dayId));
    } else {
      setBusinessDays([...businessDays, dayId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Business Hours Configuration */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="size-4 text-amber-500" /> Business Hours & Schedule
            </Label>
            <p className="text-xs text-muted-foreground">
              Define active operating hours and send custom offline replies outside these times.
            </p>
          </div>
          <Switch
            checked={businessHoursEnabled}
            onCheckedChange={setBusinessHoursEnabled}
          />
        </div>

        {businessHoursEnabled && (
          <div className="space-y-4 pt-3 border-t border-border/50">
            {/* Days Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3.5" /> Active Business Days
              </Label>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((day) => {
                  const isSelected = businessDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Start Time</Label>
                <Input
                  type="time"
                  step="1"
                  value={businessStartTime}
                  onChange={(e) => setBusinessStartTime(e.target.value)}
                  className="rounded-xl h-10 text-xs bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">End Time</Label>
                <Input
                  type="time"
                  step="1"
                  value={businessEndTime}
                  onChange={(e) => setBusinessEndTime(e.target.value)}
                  className="rounded-xl h-10 text-xs bg-background"
                />
              </div>
            </div>

            {/* Offline Fallback Message */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Moon className="size-3.5 text-indigo-400" /> Offline Response Message
              </Label>
              <Textarea
                rows={2}
                placeholder="Thanks for messaging! We are currently offline and will reply during business hours (9AM-6PM)."
                value={offlineMessage}
                onChange={(e) => setOfflineMessage(e.target.value)}
                className="rounded-xl resize-none text-sm bg-background"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Deduplication & Anti-Spam Cooldown */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-emerald-500" /> Anti-Spam Deduplication Cooldown
            </Label>
            <p className="text-xs text-muted-foreground">
              Prevent sending duplicate automated messages if the same user triggers this within a timeframe.
            </p>
          </div>
          <Switch
            checked={deduplicationEnabled}
            onCheckedChange={setDeduplicationEnabled}
          />
        </div>

        {deduplicationEnabled && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Cooldown Window (Hours)</Label>
                <Input
                  type="number"
                  min={1}
                  max={168}
                  value={deduplicationHours}
                  onChange={(e) => setDeduplicationHours(Math.max(1, parseInt(e.target.value) || 24))}
                  className="rounded-xl h-10 w-32 text-xs bg-background"
                  placeholder="24"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-4">
                The automation will run at most once per user every <strong>{deduplicationHours} hour(s)</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
