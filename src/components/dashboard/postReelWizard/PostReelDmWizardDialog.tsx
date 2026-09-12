import { useState, useEffect } from "react";
import {
  Video,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Link as LinkIcon,
  ShieldCheck,
  Loader2,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postReelDmService } from "@/services";
import { showToast } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import type { PostReelMediaItem, CreatePostReelDmRequest, PostReelDmAutomation } from "@/types";

export interface PostReelDmWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PostReelDmAutomation | null;
}

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export function PostReelDmWizardDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: PostReelDmWizardDialogProps) {
  const { activeWorkspace } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaList, setMediaList] = useState<PostReelMediaItem[]>([]);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<PostReelMediaItem | null>(null);

  // Stage 1 State
  const [initialMessageText, setInitialMessageText] = useState(
    "Hey {{first_name}} 👋 Thanks for sharing my reel! Click the button below to get the free access."
  );
  const [ctaButtonText, setCtaButtonText] = useState("Get Access 🚀");
  const [initialDelaySeconds, setInitialDelaySeconds] = useState(2);

  // Stage 2 State
  const [primaryMessageText, setPrimaryMessageText] = useState(
    "Here is your exclusive link, {{username}}! Enjoy the material ⬇️"
  );
  const [primaryButtonEnabled, setPrimaryButtonEnabled] = useState(true);
  const [primaryButtonText, setPrimaryButtonText] = useState("Start Learning");
  const [primaryButtonUrl, setPrimaryButtonUrl] = useState("https://example.com/access");
  const [primaryDelaySeconds, setPrimaryDelaySeconds] = useState(3);

  // Settings State
  const [followerCondition, setFollowerCondition] = useState<"NONE" | "FOLLOW_REQUIRED" | "FOLLOW_GATE">("FOLLOW_GATE");
  const [followGateMessage, setFollowGateMessage] = useState(
    "Hey {{first_name}}! Please follow our page first so we can unlock the exclusive link for you."
  );
  const [businessHoursEnabled, setBusinessHoursEnabled] = useState(false);
  const [businessStartTime, setBusinessStartTime] = useState("09:00:00");
  const [businessEndTime, setBusinessEndTime] = useState("18:00:00");
  const [businessDays, setBusinessDays] = useState<string[]>([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
  ]);
  const [offlineMessage, setOfflineMessage] = useState(
    "Thanks for sharing! We are currently offline and will send your link during business hours (9AM-6PM)."
  );
  const [deduplicationEnabled, setDeduplicationEnabled] = useState(true);
  const [deduplicationHours, setDeduplicationHours] = useState(24);

  // Preview interactive stage state
  const [previewStage, setPreviewStage] = useState<1 | 2>(1);

  // Load media when opening wizard
  useEffect(() => {
    if (isOpen && activeWorkspace?.workspaceId) {
      setLoadingMedia(true);
      postReelDmService
        .getMedia(activeWorkspace.workspaceId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setMediaList(res.data);
            // If editing, auto-select media
            if (initialData?.mediaId) {
              const matched = res.data.find((m) => m.id === initialData.mediaId);
              if (matched) setSelectedMedia(matched);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to load Instagram media:", err);
        })
        .finally(() => {
          setLoadingMedia(false);
        });
    }
  }, [isOpen, activeWorkspace?.workspaceId, initialData?.mediaId]);

  // Populate initialData if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      if (initialData.mediaId) {
        setSelectedMedia({
          id: initialData.mediaId,
          caption: initialData.mediaCaption,
          mediaType: initialData.mediaType || "REEL",
          mediaUrl: initialData.mediaUrl,
          thumbnailUrl: initialData.mediaThumbnailUrl,
          permalink: initialData.mediaPermalink,
        });
      }
      setInitialMessageText(initialData.initialMessageText || "");
      setCtaButtonText(initialData.ctaButtonText || "Get Access 🚀");
      setInitialDelaySeconds(initialData.initialDelaySeconds ?? 2);

      setPrimaryMessageText(initialData.primaryMessageText || "");
      setPrimaryButtonEnabled(initialData.primaryButtonEnabled ?? true);
      setPrimaryButtonText(initialData.primaryButtonText || "Start Learning");
      setPrimaryButtonUrl(initialData.primaryButtonUrl || "");
      setPrimaryDelaySeconds(initialData.primaryDelaySeconds ?? 3);

      setFollowerCondition(initialData.followerCondition || "NONE");
      setFollowGateMessage(initialData.followGateMessage || "");
      setBusinessHoursEnabled(initialData.businessHoursEnabled ?? false);
      setBusinessStartTime(initialData.businessStartTime || "09:00:00");
      setBusinessEndTime(initialData.businessEndTime || "18:00:00");
      setBusinessDays(initialData.businessDays || ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
      setOfflineMessage(initialData.offlineMessage || "");
      setDeduplicationEnabled(initialData.deduplicationEnabled ?? true);
      setDeduplicationHours(initialData.deduplicationHours ?? 24);
    } else {
      // Defaults
      setName("");
      setSelectedMedia(null);
      setStep(1);
    }
  }, [initialData, isOpen]);

  const insertVariable = (variable: string, target: "initial" | "primary" | "gate") => {
    if (target === "initial") {
      setInitialMessageText((prev) => `${prev} ${variable}`);
    } else if (target === "primary") {
      setPrimaryMessageText((prev) => `${prev} ${variable}`);
    } else {
      setFollowGateMessage((prev) => `${prev} ${variable}`);
    }
  };

  const handleToggleDay = (day: string) => {
    setBusinessDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!activeWorkspace?.workspaceId) {
      showToast("Workspace not selected", "error");
      return;
    }
    if (!name.trim()) {
      showToast("Please enter an automation name", "error");
      return;
    }
    if (!selectedMedia) {
      showToast("Please select a target Post or Reel", "error");
      return;
    }
    if (!initialMessageText.trim()) {
      showToast("Please enter Initial DM text for Stage 1", "error");
      return;
    }
    if (!ctaButtonText.trim()) {
      showToast("Please enter CTA button text", "error");
      return;
    }
    if (!primaryMessageText.trim()) {
      showToast("Please enter Primary DM text for Stage 2", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: CreatePostReelDmRequest = {
        workspaceId: activeWorkspace.workspaceId,
        name: name.trim(),
        mediaId: selectedMedia.id,
        mediaUrl: selectedMedia.mediaUrl,
        mediaPermalink: selectedMedia.permalink,
        mediaThumbnailUrl: selectedMedia.thumbnailUrl,
        mediaType: selectedMedia.mediaType,
        mediaCaption: selectedMedia.caption,

        initialMessageText: initialMessageText.trim(),
        ctaButtonText: ctaButtonText.trim(),
        initialDelaySeconds,

        primaryMessageText: primaryMessageText.trim(),
        primaryButtonEnabled,
        primaryButtonText: primaryButtonText.trim(),
        primaryButtonUrl: primaryButtonUrl.trim(),
        primaryDelaySeconds,

        followerCondition,
        followGateMessage: followGateMessage.trim() || null,

        businessHoursEnabled,
        businessStartTime: businessHoursEnabled ? businessStartTime : null,
        businessEndTime: businessHoursEnabled ? businessEndTime : null,
        businessDays: businessHoursEnabled ? businessDays : [],
        offlineMessage: businessHoursEnabled ? offlineMessage.trim() || null : null,

        deduplicationEnabled,
        deduplicationHours,
      };

      if (initialData?.id) {
        await postReelDmService.update(initialData.id, payload);
        showToast("Post/Reel DM automation updated successfully!", "success");
      } else {
        await postReelDmService.create(payload);
        showToast("Post/Reel DM automation created successfully!", "success");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Save automation error:", err);
      showToast(err.message || "Failed to save automation", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={true} className="max-w-4xl p-6 sm:p-7 rounded-3xl border shadow-2xl bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <Video className="size-4" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {initialData ? "Edit Post/Reel DM Automation" : "Create Post/Reel DM Automation"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Automate instant 2-stage DM responses when users share your Post or Reel in Instagram DM.
            </DialogDescription>
          </div>

          {/* Step Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-muted/60 p-1.5 rounded-2xl border border-border/40 text-xs font-semibold">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s as any)}
                className={`px-3 py-1 rounded-xl transition-all ${
                  step === s
                    ? "bg-pink-600 text-white shadow-xs"
                    : step > s
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted/40"
                }`}
              >
                Step {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Left Form + Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* STEP 1: Select Media & Name */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Automation Name</Label>
                  <Input
                    placeholder="e.g. Masterclass Reel Share Lead Magnet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">
                      Select Connected Post or Reel
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {mediaList.length} media available
                    </span>
                  </div>

                  {loadingMedia ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-2xl bg-muted/20">
                      <Loader2 className="size-6 text-pink-500 animate-spin mb-2" />
                      <p className="text-xs text-muted-foreground">Fetching your posts & reels...</p>
                    </div>
                  ) : mediaList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto p-1 border rounded-2xl bg-muted/20">
                      {mediaList.map((m) => {
                        const isSelected = selectedMedia?.id === m.id;
                        const imgSrc = m.thumbnailUrl || m.mediaUrl;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMedia(m)}
                            className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer aspect-square ${
                              isSelected
                                ? "border-pink-500 ring-2 ring-pink-500/30 shadow-md"
                                : "border-border hover:border-pink-500/50"
                            }`}
                          >
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={m.caption || "Media preview"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                <Video className="size-6 text-muted-foreground/40" />
                              </div>
                            )}

                            {/* Badge */}
                            <div className="absolute top-1.5 left-1.5">
                              <Badge className="text-[9px] font-bold uppercase py-0 px-1.5 bg-black/70 text-white backdrop-blur-xs border-0">
                                {m.mediaType || "REEL"}
                              </Badge>
                            </div>

                            {/* Caption overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[10px] text-white line-clamp-2">
                              {m.caption || "No caption"}
                            </div>

                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 border border-dashed rounded-2xl text-center space-y-2 bg-muted/20">
                      <p className="text-xs text-muted-foreground">
                        No Instagram Posts/Reels found for this workspace. Make sure your account is connected.
                      </p>
                    </div>
                  )}

                  {selectedMedia && (
                    <div className="p-3 rounded-xl border border-pink-500/20 bg-pink-500/5 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-pink-600">
                          Selected
                        </Badge>
                        <span className="truncate text-foreground font-medium">
                          {selectedMedia.caption || `Media ID: ${selectedMedia.id}`}
                        </span>
                      </div>
                      {selectedMedia.permalink && (
                        <a
                          href={selectedMedia.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-600 hover:underline flex items-center gap-1 shrink-0 ml-2"
                        >
                          <ExternalLink className="size-3" /> Instagram
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Stage 1 (Initial DM + CTA + Delay) */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-700 dark:text-pink-300 flex items-start gap-2">
                  <Sparkles className="size-4 shrink-0 mt-0.5 text-pink-500" />
                  <div>
                    <span className="font-semibold">Stage 1 Execution:</span> Sent immediately when a follower shares
                    your selected Post/Reel to your DM. Includes your customizable CTA Button.
                  </div>
                </div>

                {/* Message Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Initial DM Message Text</Label>
                    <div className="flex items-center gap-1">
                      {["{{first_name}}", "{{username}}", "{{automation_name}}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertVariable(tag, "initial")}
                          className="px-2 py-0.5 text-[10px] rounded-lg border bg-muted/60 hover:bg-muted text-muted-foreground font-mono transition-colors"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="Hey {{first_name}} 👋 Thanks for sharing my reel! Click below to claim your link."
                    value={initialMessageText}
                    onChange={(e) => setInitialMessageText(e.target.value)}
                    className="rounded-xl text-sm leading-relaxed"
                  />
                </div>

                {/* CTA Button Text */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">CTA Button Text (Postback)</Label>
                  <Input
                    placeholder="e.g. Get Access 🚀"
                    value={ctaButtonText}
                    onChange={(e) => setCtaButtonText(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    When the recipient taps this button, Stage 2 (Primary DM with your link) will trigger.
                  </p>
                </div>

                {/* Initial Delay Seconds */}
                <div className="p-4 rounded-2xl border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Clock className="size-3.5 text-pink-500" /> Initial Delay (Stage 1)
                    </span>
                    <span className="text-pink-600 dark:text-pink-400 font-bold">{initialDelaySeconds}s delay</span>
                  </div>
                  <Slider
                    value={[initialDelaySeconds]}
                    onValueChange={(val) => setInitialDelaySeconds(val[0])}
                    min={0}
                    max={60}
                    step={1}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Instant (0s)</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Stage 2 (Primary DM + Link + Delay) */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                  <Check className="size-4 shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <span className="font-semibold">Stage 2 Execution:</span> Dispatched after the user taps the Stage
                    1 CTA Button. Delivers your high-value resource link or product URL.
                  </div>
                </div>

                {/* Primary Message Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Primary DM Message Text</Label>
                    <div className="flex items-center gap-1">
                      {["{{first_name}}", "{{username}}", "{{link}}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertVariable(tag, "primary")}
                          className="px-2 py-0.5 text-[10px] rounded-lg border bg-muted/60 hover:bg-muted text-muted-foreground font-mono transition-colors"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="Here is your exclusive link: {{link}} Enjoy!"
                    value={primaryMessageText}
                    onChange={(e) => setPrimaryMessageText(e.target.value)}
                    className="rounded-xl text-sm leading-relaxed"
                  />
                </div>

                {/* Button Link Settings */}
                <div className="p-4 rounded-2xl border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold text-foreground">Attach Direct URL Button</Label>
                      <p className="text-[11px] text-muted-foreground">Include a clickable web button in Stage 2 DM.</p>
                    </div>
                    <Switch checked={primaryButtonEnabled} onCheckedChange={setPrimaryButtonEnabled} />
                  </div>

                  {primaryButtonEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/50">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-muted-foreground">Button Text</Label>
                        <Input
                          placeholder="e.g. Start Learning"
                          value={primaryButtonText}
                          onChange={(e) => setPrimaryButtonText(e.target.value)}
                          className="rounded-xl h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-muted-foreground">Destination Web URL</Label>
                        <Input
                          placeholder="https://example.com/course"
                          value={primaryButtonUrl}
                          onChange={(e) => setPrimaryButtonUrl(e.target.value)}
                          className="rounded-xl h-10 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Delay Seconds */}
                <div className="p-4 rounded-2xl border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Clock className="size-3.5 text-emerald-500" /> Primary Delay (Stage 2)
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{primaryDelaySeconds}s delay</span>
                  </div>
                  <Slider
                    value={[primaryDelaySeconds]}
                    onValueChange={(val) => setPrimaryDelaySeconds(val[0])}
                    min={0}
                    max={60}
                    step={1}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Instant (0s)</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Gating & Business Rules */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                {/* Follower Condition */}
                <div className="p-4 rounded-2xl border bg-muted/30 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-pink-500" /> Follow-Gate Verification
                    </Label>
                    <Select
                      value={followerCondition}
                      onValueChange={(val: any) => setFollowerCondition(val)}
                    >
                      <SelectTrigger className="rounded-xl h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">No Condition (Deliver to all users)</SelectItem>
                        <SelectItem value="FOLLOW_REQUIRED">Follow Required (Must follow account)</SelectItem>
                        <SelectItem value="FOLLOW_GATE">Follow Gate (Prompts follow before link unlock)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {followerCondition !== "NONE" && (
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      <Label className="text-xs font-semibold text-muted-foreground">Follow-Gate Message</Label>
                      <Textarea
                        rows={2}
                        value={followGateMessage}
                        onChange={(e) => setFollowGateMessage(e.target.value)}
                        placeholder="Please follow our page first to unlock your access!"
                        className="rounded-xl text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Deduplication */}
                <div className="p-4 rounded-2xl border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold text-foreground">Anti-Spam Deduplication</Label>
                      <p className="text-[11px] text-muted-foreground">
                        Prevents duplicate sends if the same user shares the reel again within a time window.
                      </p>
                    </div>
                    <Switch checked={deduplicationEnabled} onCheckedChange={setDeduplicationEnabled} />
                  </div>

                  {deduplicationEnabled && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <Label className="text-xs font-semibold text-muted-foreground">Cooldown Window (Hours):</Label>
                      <Input
                        type="number"
                        min={1}
                        max={168}
                        value={deduplicationHours}
                        onChange={(e) => setDeduplicationHours(Number(e.target.value))}
                        className="w-24 h-9 rounded-xl text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Business Hours */}
                <div className="p-4 rounded-2xl border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="size-4 text-blue-500" /> Business Hours Only
                      </Label>
                      <p className="text-[11px] text-muted-foreground">Only trigger within specific working hours.</p>
                    </div>
                    <Switch checked={businessHoursEnabled} onCheckedChange={setBusinessHoursEnabled} />
                  </div>

                  {businessHoursEnabled && (
                    <div className="space-y-3 pt-2 border-t border-border/50">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Start Time</Label>
                          <Input
                            type="time"
                            value={businessStartTime}
                            onChange={(e) => setBusinessStartTime(e.target.value)}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">End Time</Label>
                          <Input
                            type="time"
                            value={businessEndTime}
                            onChange={(e) => setBusinessEndTime(e.target.value)}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Active Days</Label>
                        <div className="flex flex-wrap gap-1">
                          {DAYS_OF_WEEK.map((day) => {
                            const isSelected = businessDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleToggleDay(day)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-background text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                {day.substring(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Offline Auto-Reply</Label>
                        <Input
                          value={offlineMessage}
                          onChange={(e) => setOfflineMessage(e.target.value)}
                          placeholder="We are currently offline..."
                          className="rounded-xl h-9 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Live Instagram Chat Mockup (5 Cols) */}
          <div className="lg:col-span-5 bg-muted/40 p-4 rounded-3xl border border-border/60 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-pink-500" /> Live Preview
                </span>
                <div className="flex items-center gap-1 bg-background p-1 rounded-xl border">
                  <button
                    type="button"
                    onClick={() => setPreviewStage(1)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                      previewStage === 1 ? "bg-pink-600 text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Stage 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewStage(2)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                      previewStage === 2 ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Stage 2
                  </button>
                </div>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-3 shadow-xs min-h-[260px]">
                {/* Simulated Reel Share Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-muted p-2.5 space-y-1.5 border border-border">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                      <Video className="size-3 text-pink-500" /> @user shared your {selectedMedia?.mediaType || "Reel"}
                    </div>
                    {selectedMedia?.thumbnailUrl || selectedMedia?.mediaUrl ? (
                      <div className="h-20 rounded-lg overflow-hidden border border-border/40">
                        <img
                          src={selectedMedia.thumbnailUrl || selectedMedia.mediaUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-background text-[10px] text-muted-foreground truncate">
                        {selectedMedia?.caption || "How to scale your Instagram leads 🚀"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage 1 Preview Bubble */}
                {previewStage === 1 ? (
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] text-muted-foreground ml-2">Stage 1 ({initialDelaySeconds}s delay)</span>
                    <div className="max-w-[90%] rounded-2xl rounded-tl-xs bg-primary text-primary-foreground p-3 space-y-2 shadow-xs">
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">
                        {initialMessageText.replace("{{first_name}}", "Alex").replace("{{username}}", "@alex_dev") ||
                          "Thanks for sharing my reel!"}
                      </p>
                      {ctaButtonText && (
                        <button
                          type="button"
                          onClick={() => setPreviewStage(2)}
                          className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold bg-background text-foreground hover:bg-muted flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <MousePointerClick className="size-3 text-pink-500" />
                          {ctaButtonText}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Stage 2 Preview Bubble */
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] text-muted-foreground ml-2">Stage 2 ({primaryDelaySeconds}s delay)</span>
                    <div className="max-w-[90%] rounded-2xl rounded-tl-xs bg-emerald-600 text-white p-3 space-y-2 shadow-xs">
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">
                        {primaryMessageText.replace("{{first_name}}", "Alex").replace("{{username}}", "@alex_dev").replace("{{link}}", primaryButtonUrl || "https://...") ||
                          "Here is your link!"}
                      </p>
                      {primaryButtonEnabled && (
                        <div className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold bg-white text-emerald-700 flex items-center justify-center gap-1.5 shadow-xs">
                          <LinkIcon className="size-3" />
                          {primaryButtonText || "Open Link"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="text-[11px] text-muted-foreground bg-card p-3 rounded-2xl border space-y-1">
              <div className="flex justify-between">
                <span>Trigger:</span>
                <span className="font-semibold text-foreground">Post/Reel DM Share</span>
              </div>
              <div className="flex justify-between">
                <span>Total Workflow Delays:</span>
                <span className="font-semibold text-foreground">{initialDelaySeconds + primaryDelaySeconds}s total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="rounded-xl text-xs gap-1.5"
            >
              <ArrowLeft className="size-4" /> Previous
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl text-xs">
              Cancel
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="rounded-xl text-xs gap-1.5 font-semibold bg-pink-600 hover:bg-pink-700 text-white"
              >
                Next Step <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl text-xs gap-1.5 font-semibold bg-pink-600 hover:bg-pink-700 text-white px-6"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Check className="size-4" /> Save Automation
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
