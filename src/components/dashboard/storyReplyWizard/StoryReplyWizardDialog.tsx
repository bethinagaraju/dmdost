import { useState, useEffect } from "react";
import { Smartphone, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { storyReplyDmAutomationService } from "@/services";
import { showToast } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import type { 
  StoryReplyDmAutomation, 
  StoryReplyTriggerType, 
  StoryReplyFollowerCondition,
  StoryScope
} from "@/types";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface StoryReplyWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingAutomation: StoryReplyDmAutomation | null;
  onSaveSuccess: (savedAutomation: StoryReplyDmAutomation, isEdit: boolean) => void;
}

export function StoryReplyWizardDialog({
  isOpen,
  onClose,
  editingAutomation,
  onSaveSuccess,
}: StoryReplyWizardDialogProps) {
  const { activeWorkspace } = useAuth();
  
  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);
  const [availableStories, setAvailableStories] = useState<any[]>([]);

  // Form States
  const [autoName, setAutoName] = useState("NEW STORY REPLY AUTOMATION");
  const [priority, setPriority] = useState(1);
  const [storyScope, setStoryScope] = useState<StoryScope>("ALL_STORIES");
  const [storyIds, setStoryIds] = useState<string[]>([]);
  
  const [triggerType, setTriggerType] = useState<StoryReplyTriggerType>("ANY_REPLY");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  
  const [initialMessageText, setInitialMessageText] = useState("Thanks for replying to my story! Tap below for the link.");
  const [ctaButtonText, setCtaButtonText] = useState("Get Link");
  const [initialDelaySeconds, setInitialDelaySeconds] = useState(0);
  
  const [primaryMessageText, setPrimaryMessageText] = useState("Here is the link you requested!");
  const [primaryButtonEnabled, setPrimaryButtonEnabled] = useState(true);
  const [primaryButtonText, setPrimaryButtonText] = useState("Click Here");
  const [primaryButtonUrl, setPrimaryButtonUrl] = useState("https://google.com");
  const [primaryDelaySeconds, setPrimaryDelaySeconds] = useState(0);
  
  const [followRequired, setFollowRequired] = useState(false);
  const [followGateMessage, setFollowGateMessage] = useState("");
  
  const [businessHoursEnabled, setBusinessHoursEnabled] = useState(false);
  const [deduplicationEnabled, setDeduplicationEnabled] = useState(true);
  const [deduplicationHours, setDeduplicationHours] = useState(24);

  // Fetch stories
  useEffect(() => {
    if (isOpen && activeWorkspace?.workspaceId) {
      setLoadingStories(true);
      storyReplyDmAutomationService.getStories(activeWorkspace.workspaceId)
        .then(res => {
          if (res.success && res.data) {
            setAvailableStories(res.data);
          }
        })
        .catch(err => {
          console.error("Failed to load stories:", err);
        })
        .finally(() => {
          setLoadingStories(false);
        });
    }
  }, [isOpen, activeWorkspace]);

  // Reset or load data
  useEffect(() => {
    if (isOpen) {
      setWizardStep(1);
      
      if (editingAutomation) {
        setAutoName(editingAutomation.name);
        setPriority(editingAutomation.priority ?? 1);
        setStoryScope(editingAutomation.storyScope ?? "ALL_STORIES");
        setStoryIds(editingAutomation.storyIds || []);
        setTriggerType(editingAutomation.triggerType);
        setKeywords(editingAutomation.keywords || []);
        setInitialMessageText(editingAutomation.initialMessageText);
        setCtaButtonText(editingAutomation.ctaButtonText);
        setInitialDelaySeconds(editingAutomation.initialDelaySeconds || 0);
        setPrimaryMessageText(editingAutomation.primaryMessageText);
        setPrimaryButtonEnabled(editingAutomation.primaryButtonEnabled);
        setPrimaryButtonText(editingAutomation.primaryButtonText);
        setPrimaryButtonUrl(editingAutomation.primaryButtonUrl);
        setPrimaryDelaySeconds(editingAutomation.primaryDelaySeconds || 0);
        setFollowRequired(editingAutomation.followerCondition === "FOLLOW_REQUIRED" || editingAutomation.followerCondition === "FOLLOW_GATE");
        setFollowGateMessage(editingAutomation.followGateMessage || "");
        setBusinessHoursEnabled(editingAutomation.businessHoursEnabled || false);
        setDeduplicationEnabled(editingAutomation.deduplicationEnabled ?? true);
        setDeduplicationHours(editingAutomation.deduplicationHours ?? 24);
      } else {
        setAutoName("NEW STORY REPLY AUTOMATION");
        setPriority(1);
        setStoryScope("ALL_STORIES");
        setStoryIds([]);
        setTriggerType("ANY_REPLY");
        setKeywords([]);
        setInitialMessageText("Thanks for replying to my story! Tap below for the link.");
        setCtaButtonText("Get Link");
        setInitialDelaySeconds(0);
        setPrimaryMessageText("Here is the link you requested!");
        setPrimaryButtonEnabled(true);
        setPrimaryButtonText("Click Here");
        setPrimaryButtonUrl("https://google.com");
        setPrimaryDelaySeconds(0);
        setFollowRequired(false);
        setFollowGateMessage("");
        setBusinessHoursEnabled(false);
        setDeduplicationEnabled(true);
        setDeduplicationHours(24);
      }
    }
  }, [isOpen, editingAutomation]);

  const isStep1Valid = () => {
    if (!autoName.trim()) return false;
    if (storyScope === "SELECTED_STORIES" && storyIds.length === 0) return false;
    if (triggerType === "KEYWORD_MATCH" && keywords.length === 0) return false;
    return true;
  };

  const isStep2Valid = () => {
    if (!initialMessageText.trim()) return false;
    if (!ctaButtonText.trim()) return false;
    return true;
  };

  const isStep3Valid = () => {
    if (!primaryMessageText.trim()) return false;
    if (primaryButtonEnabled && (!primaryButtonText.trim() || !primaryButtonUrl.trim())) return false;
    return true;
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };
  
  const handleToggleStorySelection = (storyId: string) => {
    setStoryIds(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleSave = async () => {
    if (!isStep1Valid() || !isStep2Valid() || !isStep3Valid()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        workspaceId: activeWorkspace?.workspaceId || "ws_default",
        name: autoName,
        priority,
        storyScope,
        storyIds: storyScope === "ALL_STORIES" ? [] : storyIds,
        triggerType,
        keywords,
        initialMessageText,
        ctaButtonText,
        initialDelaySeconds,
        primaryMessageText,
        primaryButtonEnabled,
        primaryButtonText,
        primaryButtonUrl,
        primaryDelaySeconds,
        followerCondition: followRequired ? "FOLLOW_REQUIRED" : "NONE",
        followGateMessage: followRequired ? followGateMessage : "",
        businessHoursEnabled,
        deduplicationEnabled,
        deduplicationHours: deduplicationEnabled ? deduplicationHours : 0
      };

      if (editingAutomation?.id) {
        const res = await storyReplyDmAutomationService.update(editingAutomation.id, payload);
        if (res.success && res.data) {
          onSaveSuccess(res.data, true);
          showToast("Story Reply Automation updated successfully!", "success");
        }
      } else {
        const res = await storyReplyDmAutomationService.create(payload);
        if (res.success && res.data) {
          onSaveSuccess(res.data, false);
          showToast("Story Reply Automation created successfully!", "success");
        }
      }
    } catch (error: any) {
      console.error("Save automation error:", error);
      showToast(error.message || "Failed to save automation", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent showCloseButton={false} className="max-w-3xl p-0 overflow-hidden rounded-3xl border shadow-2xl bg-card">
        <DialogDescription className="sr-only">
          Configure Story Reply triggers, initial DMs, and primary messages
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Smartphone className="size-4" />
            </div>
            <DialogTitle className="font-semibold text-base text-foreground">
              {editingAutomation ? "Edit Story Reply Automation" : "Create Story Reply Automation"}
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Step 1: Trigger & Scope */}
          {wizardStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Automation Name</label>
                  <input 
                    type="text"
                    value={autoName}
                    onChange={(e) => setAutoName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <input 
                    type="number"
                    min="1"
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Lower number = higher priority</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Story Scope</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div
                    onClick={() => setStoryScope("ALL_STORIES")}
                    className={`p-3 rounded-lg border cursor-pointer ${storyScope === "ALL_STORIES" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-muted"}`}
                  >
                    <div className="font-medium text-sm">All Stories</div>
                    <div className="text-xs text-muted-foreground mt-1">Applies to replies on any active story</div>
                  </div>
                  <div
                    onClick={() => setStoryScope("SELECTED_STORIES")}
                    className={`p-3 rounded-lg border cursor-pointer ${storyScope === "SELECTED_STORIES" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-muted"}`}
                  >
                    <div className="font-medium text-sm">Selected Stories</div>
                    <div className="text-xs text-muted-foreground mt-1">Applies only to specific stories you select</div>
                  </div>
                </div>
              </div>
              
              {storyScope === "SELECTED_STORIES" && (
                <div className="space-y-3 p-4 border rounded-xl bg-muted/20">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Select Stories ({storyIds.length} selected)</label>
                    {loadingStories && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                  </div>
                  
                  {availableStories.length === 0 && !loadingStories ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No active stories found for this account.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1">
                      {availableStories.map(story => {
                        const isSelected = storyIds.includes(story.id);
                        return (
                          <div 
                            key={story.id}
                            onClick={() => handleToggleStorySelection(story.id)}
                            className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? "border-orange-500 shadow-md ring-2 ring-orange-500/20" : "border-transparent hover:border-orange-500/50"}`}
                          >
                            <img 
                              src={story.thumbnailUrl || story.mediaUrl} 
                              alt="Story thumbnail"
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                <div className="bg-orange-500 text-white rounded-full p-1 shadow-lg">
                                  <Check className="size-4" />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Trigger Type</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div
                    onClick={() => setTriggerType("ANY_REPLY")}
                    className={`p-3 rounded-lg border cursor-pointer ${triggerType === "ANY_REPLY" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-muted"}`}
                  >
                    <div className="font-medium text-sm">Any Reply</div>
                    <div className="text-xs text-muted-foreground mt-1">Triggers when user sends any reply</div>
                  </div>
                  <div
                    onClick={() => setTriggerType("KEYWORD_MATCH")}
                    className={`p-3 rounded-lg border cursor-pointer ${triggerType === "KEYWORD_MATCH" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-muted"}`}
                  >
                    <div className="font-medium text-sm">Specific Keywords</div>
                    <div className="text-xs text-muted-foreground mt-1">Triggers only if the reply matches keywords</div>
                  </div>
                </div>
              </div>

              {triggerType === "KEYWORD_MATCH" && (
                <div>
                  <label className="text-sm font-medium">Keywords</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="e.g. LINK, PROMO"
                      className="flex-1 px-3 py-2 border rounded-lg bg-background"
                    />
                    <Button type="button" onClick={handleAddKeyword} variant="secondary">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {keywords.map(kw => (
                      <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                        {kw}
                        <button onClick={() => handleRemoveKeyword(kw)} className="hover:text-red-500"><X className="size-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Initial Message */}
          {wizardStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  First Message (Opt-in DM)
                </span>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Opt-in Message Content</Label>
                  <Textarea
                    placeholder="e.g. Thanks for the reply! Tap below to get your link."
                    value={initialMessageText}
                    onChange={(e) => setInitialMessageText(e.target.value)}
                    rows={3}
                    className="rounded-xl resize-none text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    This is the first message sent to the user's DM.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">CTA Button Text</Label>
                    <input
                      type="text"
                      value={ctaButtonText}
                      onChange={(e) => setCtaButtonText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                      placeholder="e.g. Get Link 🎁"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Delay (Seconds)</Label>
                    <input
                      type="number"
                      min="0"
                      value={initialDelaySeconds}
                      onChange={(e) => setInitialDelaySeconds(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                    />
                  </div>
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
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Primary Message & Config */}
          {wizardStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Primary Message
                </span>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Welcome Message Content</Label>
                  <Textarea
                    value={primaryMessageText}
                    onChange={(e) => setPrimaryMessageText(e.target.value)}
                    className="rounded-xl resize-none text-sm"
                    rows={3}
                  />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Sent after they click the CTA button.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-xl space-y-3 bg-muted/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include Link Button</span>
                  <Switch 
                    checked={primaryButtonEnabled} 
                    onCheckedChange={setPrimaryButtonEnabled} 
                  />
                </div>
                {primaryButtonEnabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Button Text</Label>
                      <input type="text" value={primaryButtonText} onChange={e => setPrimaryButtonText(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">URL</Label>
                      <input type="url" value={primaryButtonUrl} onChange={e => setPrimaryButtonUrl(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm bg-background" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Primary Delay (Seconds)</Label>
                <input
                  type="number"
                  min="0"
                  value={primaryDelaySeconds}
                  onChange={(e) => setPrimaryDelaySeconds(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                />
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="dedup" checked={deduplicationEnabled} onChange={e => setDeduplicationEnabled(e.target.checked)} />
                  <label htmlFor="dedup" className="text-sm">Duplication Window</label>
                </div>
                {deduplicationEnabled && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Window (Hours)</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-16 px-2 py-1 border rounded text-sm bg-background" 
                      value={deduplicationHours} 
                      onChange={e => setDeduplicationHours(parseInt(e.target.value) || 24)} 
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <input type="checkbox" id="bh" checked={businessHoursEnabled} onChange={e => setBusinessHoursEnabled(e.target.checked)} />
                  <label htmlFor="bh" className="text-sm">Business Hours Only</label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
          <span className="text-sm text-muted-foreground font-medium">
            Step {wizardStep} of 3
          </span>
          <div className="flex items-center gap-2">
            {wizardStep > 1 ? (
              <Button
                variant="outline"
                onClick={() => setWizardStep(prev => prev - 1)}
                className="px-4 py-2"
              >
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 py-2"
              >
                Cancel
              </Button>
            )}

            {wizardStep < 3 ? (
              <Button
                onClick={() => setWizardStep(prev => prev + 1)}
                disabled={wizardStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                className="bg-orange-600 hover:bg-orange-700 text-white border-0 px-5 py-2 font-medium"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!isStep3Valid() || isCreating}
                className="bg-orange-600 hover:bg-orange-700 text-white border-0 px-5 py-2 font-medium"
              >
                {isCreating ? (editingAutomation ? "Saving..." : "Creating...") : (editingAutomation ? "Save Changes" : "Create Automation")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
