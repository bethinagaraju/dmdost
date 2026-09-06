import { useState, useEffect } from "react";
import { MessageSquare, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { dmAutomationService } from "@/services";
import { showToast } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import type {
  DmAutomation,
  DmTriggerType,
  DmMatchMode,
  DmFollowerCondition,
  DmMessageStep,
} from "@/types";
import { StepDmTrigger } from "./StepDmTrigger";
import { StepDmSequence } from "./StepDmSequence";
import { StepDmSettings } from "./StepDmSettings";

export interface DmAutomationWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingAutomation: DmAutomation | null;
  onSaveSuccess: (saved: any, isEdit: boolean) => void;
}

export function DmAutomationWizardDialog({
  isOpen,
  onClose,
  editingAutomation,
  onSaveSuccess,
}: DmAutomationWizardDialogProps) {
  const { activeWorkspace } = useAuth();

  // Wizard Navigation
  const [wizardStep, setWizardStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Step 1: Trigger & Keywords
  const [name, setName] = useState("Direct Message Automation");
  const [priority, setPriority] = useState(1);
  const [triggerType, setTriggerType] = useState<DmTriggerType>("KEYWORD");
  const [matchMode, setMatchMode] = useState<DmMatchMode>("CONTAINS");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(["price", "link"]);
  const [followerCondition, setFollowerCondition] = useState<DmFollowerCondition>("NONE");
  const [followGateMessage, setFollowGateMessage] = useState(
    "Hey {{username}}! 👋 Please follow our account first so we can send you the details."
  );

  // Step 2: Multi-step message sequence
  const [messageSteps, setMessageSteps] = useState<DmMessageStep[]>([
    {
      stepOrder: 1,
      messageText: "Hi {{first_name}} 👋 Thanks for reaching out!",
      delaySeconds: 0,
      buttonEnabled: false,
    },
    {
      stepOrder: 2,
      messageText: "Here is your exclusive link:",
      delaySeconds: 2,
      buttonEnabled: true,
      buttonType: "WEB_URL",
      buttonText: "Get Access",
      buttonUrl: "https://dmdost.in",
    },
  ]);

  // Step 3: Business Hours & Deduplication
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
    "Thanks for messaging! We are currently offline and will reply during business hours (9AM-6PM)."
  );
  const [deduplicationEnabled, setDeduplicationEnabled] = useState(true);
  const [deduplicationHours, setDeduplicationHours] = useState(24);

  // Reset or load initial data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setWizardStep(1);
      setIsLoadingDetails(false);

      if (editingAutomation) {
        // Populate existing automation
        setName(editingAutomation.name || "Direct Message Automation");
        setPriority(editingAutomation.priority || 1);
        setTriggerType(editingAutomation.triggerType || "KEYWORD");
        setMatchMode(editingAutomation.matchMode || "CONTAINS");
        setCaseSensitive(editingAutomation.caseSensitive ?? false);
        setKeywords(editingAutomation.keywords || ["price"]);
        setFollowerCondition(editingAutomation.followerCondition || "NONE");
        setFollowGateMessage(
          editingAutomation.followGateMessage ||
            "Hey {{username}}! 👋 Please follow our account first so we can send you the details."
        );
        setMessageSteps(
          editingAutomation.messageSteps && editingAutomation.messageSteps.length > 0
            ? editingAutomation.messageSteps
            : [
                {
                  stepOrder: 1,
                  messageText: "Hi {{first_name}} 👋 Thanks for reaching out!",
                  delaySeconds: 0,
                  buttonEnabled: false,
                },
              ]
        );
        setBusinessHoursEnabled(editingAutomation.businessHoursEnabled ?? false);
        setBusinessStartTime(editingAutomation.businessStartTime || "09:00:00");
        setBusinessEndTime(editingAutomation.businessEndTime || "18:00:00");
        setBusinessDays(
          editingAutomation.businessDays || [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
          ]
        );
        setOfflineMessage(
          editingAutomation.offlineMessage ||
            "Thanks for messaging! We are currently offline and will reply during business hours (9AM-6PM)."
        );
        setDeduplicationEnabled(editingAutomation.deduplicationEnabled ?? true);
        setDeduplicationHours(editingAutomation.deduplicationHours || 24);

        // Fetch full details if needed
        if (editingAutomation.id && !editingAutomation.messageSteps) {
          setIsLoadingDetails(true);
          dmAutomationService
            .getById(editingAutomation.id)
            .then((res) => {
              if (res.success && res.data) {
                const d = res.data;
                setName(d.name || editingAutomation.name);
                setPriority(d.priority || 1);
                setTriggerType(d.triggerType || "KEYWORD");
                setMatchMode(d.matchMode || "CONTAINS");
                setCaseSensitive(d.caseSensitive ?? false);
                setKeywords(d.keywords || ["price"]);
                setFollowerCondition(d.followerCondition || "NONE");
                setFollowGateMessage(d.followGateMessage || "");
                if (d.messageSteps && d.messageSteps.length > 0) {
                  setMessageSteps(d.messageSteps);
                }
                setBusinessHoursEnabled(d.businessHoursEnabled ?? false);
                setBusinessStartTime(d.businessStartTime || "09:00:00");
                setBusinessEndTime(d.businessEndTime || "18:00:00");
                if (d.businessDays) setBusinessDays(d.businessDays);
                setOfflineMessage(d.offlineMessage || "");
                setDeduplicationEnabled(d.deduplicationEnabled ?? true);
                setDeduplicationHours(d.deduplicationHours || 24);
              }
            })
            .catch((err) => {
              console.error("Failed to load DM automation details:", err);
            })
            .finally(() => {
              setIsLoadingDetails(false);
            });
        }
      } else {
        // Defaults for new automation
        setName("Direct Message Automation");
        setPriority(1);
        setTriggerType("KEYWORD");
        setMatchMode("CONTAINS");
        setCaseSensitive(false);
        setKeywords(["price", "course"]);
        setFollowerCondition("NONE");
        setFollowGateMessage(
          "Hey {{username}}! 👋 Please follow our account first so we can send you the details."
        );
        setMessageSteps([
          {
            stepOrder: 1,
            messageText: "Hi {{first_name}} 👋 Thanks for reaching out to us!",
            delaySeconds: 0,
            buttonEnabled: false,
          },
          {
            stepOrder: 2,
            messageText: "Here is the exclusive link you requested:",
            delaySeconds: 2,
            buttonEnabled: true,
            buttonType: "WEB_URL",
            buttonText: "Get Access",
            buttonUrl: "https://dmdost.in",
          },
        ]);
        setBusinessHoursEnabled(false);
        setBusinessStartTime("09:00:00");
        setBusinessEndTime("18:00:00");
        setBusinessDays(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
        setOfflineMessage(
          "Thanks for messaging! We are currently offline and will reply during business hours (9AM-6PM)."
        );
        setDeduplicationEnabled(true);
        setDeduplicationHours(24);
      }
    }
  }, [isOpen, editingAutomation]);

  // Validation
  const isStep1Valid = () => {
    if (!name.trim()) return false;
    if (triggerType !== "ANY_DM" && keywords.length === 0) return false;
    if (followerCondition !== "NONE" && !followGateMessage.trim()) return false;
    return true;
  };

  const isStep2Valid = () => {
    if (messageSteps.length === 0) return false;
    for (const step of messageSteps) {
      if (!step.messageText.trim()) return false;
      if (step.buttonEnabled) {
        if (!step.buttonText?.trim() || !step.buttonUrl?.trim()) return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!isStep1Valid() || !isStep2Valid()) {
      showToast("Please complete all required fields", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<DmAutomation> = {
        workspaceId: activeWorkspace?.workspaceId || "ws_default",
        name: name.trim(),
        priority,
        triggerType,
        matchMode,
        caseSensitive,
        keywords: triggerType === "ANY_DM" ? [] : keywords,
        followerCondition,
        followGateMessage: followerCondition !== "NONE" ? followGateMessage.trim() : null,
        messageSteps: messageSteps.map((s, idx) => ({
          stepOrder: idx + 1,
          messageText: s.messageText.trim(),
          delaySeconds: Number(s.delaySeconds) || 0,
          buttonEnabled: s.buttonEnabled,
          buttonType: s.buttonEnabled ? s.buttonType || "WEB_URL" : null,
          buttonText: s.buttonEnabled ? s.buttonText?.trim() || null : null,
          buttonUrl: s.buttonEnabled ? s.buttonUrl?.trim() || null : null,
          buttonPayload: null,
        })),
        businessHoursEnabled,
        businessStartTime: businessHoursEnabled ? businessStartTime : null,
        businessEndTime: businessHoursEnabled ? businessEndTime : null,
        businessDays: businessHoursEnabled ? businessDays : [],
        offlineMessage: businessHoursEnabled ? offlineMessage.trim() : null,
        deduplicationEnabled,
        deduplicationHours: deduplicationEnabled ? Number(deduplicationHours) || 24 : 0,
      };

      if (editingAutomation?.id) {
        console.log("Updating DM automation:", payload);
        const res = await dmAutomationService.update(editingAutomation.id, payload);
        if (res.success) {
          showToast("DM automation updated successfully!", "success");
          onSaveSuccess(
            {
              ...editingAutomation,
              ...payload,
              id: editingAutomation.id,
              type: "DM_AUTOMATION",
              updatedAt: res.data?.updatedAt || new Date().toISOString(),
            },
            true
          );
        }
      } else {
        console.log("Creating DM automation:", payload);
        const res = await dmAutomationService.create(payload);
        if (res.success) {
          showToast("DM automation created successfully!", "success");
          onSaveSuccess(
            {
              ...(res.data || payload),
              id: res.data?.id || `dm_auto_${Date.now()}`,
              type: "DM_AUTOMATION",
              status: (res.data?.status || "ACTIVE").toLowerCase(),
              createdAt: res.data?.createdAt || new Date().toISOString(),
              runs: 0,
              dmsSent: 0,
              buttonClicks: 0,
              stepsCount: messageSteps.length,
            },
            false
          );
        }
      }
    } catch (err: any) {
      console.error("Save DM automation error:", err);
      showToast(err.message || "Failed to save DM automation", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-2xl p-0 overflow-hidden rounded-3xl border shadow-2xl bg-card">
        <DialogDescription className="sr-only">
          Configure direct message automated triggers, multi-step sequences, follower gates, and business hours.
        </DialogDescription>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <MessageSquare className="size-4" />
            </div>
            <DialogTitle className="font-semibold text-base text-foreground">
              {editingAutomation ? "Edit DM Automation" : "Create Direct Message Automation"}
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Steps Progress Tabs */}
        <div className="grid grid-cols-3 border-b border-border bg-muted/10 text-xs font-medium">
          {[
            { step: 1, label: "1. Trigger & Keywords" },
            { step: 2, label: "2. Message Sequence" },
            { step: 3, label: "3. Schedule & Limits" },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step === 1 || (item.step === 2 && isStep1Valid()) || (item.step === 3 && isStep1Valid() && isStep2Valid())) {
                  setWizardStep(item.step);
                }
              }}
              className={`py-2.5 text-center transition-colors border-b-2 ${
                wizardStep === item.step
                  ? "border-primary text-primary font-semibold bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 max-h-[65vh] overflow-y-auto space-y-6">
          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                Loading automation configuration...
              </p>
            </div>
          ) : (
            <>
              {wizardStep === 1 && (
                <StepDmTrigger
                  name={name}
                  setName={setName}
                  priority={priority}
                  setPriority={setPriority}
                  triggerType={triggerType}
                  setTriggerType={setTriggerType}
                  matchMode={matchMode}
                  setMatchMode={setMatchMode}
                  caseSensitive={caseSensitive}
                  setCaseSensitive={setCaseSensitive}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  followerCondition={followerCondition}
                  setFollowerCondition={setFollowerCondition}
                  followGateMessage={followGateMessage}
                  setFollowGateMessage={setFollowGateMessage}
                />
              )}

              {wizardStep === 2 && (
                <StepDmSequence
                  steps={messageSteps}
                  setSteps={setMessageSteps}
                />
              )}

              {wizardStep === 3 && (
                <StepDmSettings
                  businessHoursEnabled={businessHoursEnabled}
                  setBusinessHoursEnabled={setBusinessHoursEnabled}
                  businessStartTime={businessStartTime}
                  setBusinessStartTime={setBusinessStartTime}
                  businessEndTime={businessEndTime}
                  setBusinessEndTime={setBusinessEndTime}
                  businessDays={businessDays}
                  setBusinessDays={setBusinessDays}
                  offlineMessage={offlineMessage}
                  setOfflineMessage={setOfflineMessage}
                  deduplicationEnabled={deduplicationEnabled}
                  setDeduplicationEnabled={setDeduplicationEnabled}
                  deduplicationHours={deduplicationHours}
                  setDeduplicationHours={setDeduplicationHours}
                />
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isLoadingDetails && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
            <span className="text-sm text-muted-foreground font-medium">
              Step {wizardStep} of 3
            </span>
            <div className="flex items-center gap-2">
              {wizardStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setWizardStep((prev) => prev - 1)}
                  className="px-4 py-2"
                >
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={onClose} className="px-4 py-2">
                  Cancel
                </Button>
              )}

              {wizardStep < 3 ? (
                <Button
                  onClick={() => setWizardStep((prev) => prev + 1)}
                  disabled={wizardStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className="gradient-brand text-white border-0 hover:opacity-90 px-5 py-2 font-medium"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={!isStep1Valid() || !isStep2Valid() || isSaving}
                  className="gradient-brand text-white border-0 hover:opacity-90 px-5 py-2 font-medium"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-4 animate-spin" /> Saving...
                    </span>
                  ) : editingAutomation ? (
                    "Save Changes"
                  ) : (
                    "Create DM Automation"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
