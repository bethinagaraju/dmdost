import { useState, useEffect } from "react";
import { Zap, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { automationService, instagramService } from "@/services";
import { showToast } from "@/hooks";
import type { Automation } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { StepPostsScope } from "./wizard/StepPostsScope";
import { StepTriggerReplies } from "./wizard/StepTriggerReplies";
import { StepMessagesDelay } from "./wizard/StepMessagesDelay";

export interface AutomationWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingAutomation: Automation | null;
  onSaveSuccess: (savedAutomation: Automation, isEdit: boolean) => void;
}

export function AutomationWizardDialog({
  isOpen,
  onClose,
  editingAutomation,
  onSaveSuccess,
}: AutomationWizardDialogProps) {
  const { activeWorkspace } = useAuth();
  
  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [autoName, setAutoName] = useState("NEW CLOUD AUTOMATION");
  const [postScope, setPostScope] = useState<"SELECTED_POSTS" | "ANY_POST" | "NEXT_POST">("SELECTED_POSTS");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [triggerType, setTriggerType] = useState<"COMMENT_KEYWORD" | "ANY_COMMENT">("COMMENT_KEYWORD");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [replyToComment, setReplyToComment] = useState(false);
  const [commentReply1, setCommentReply1] = useState("");
  const [commentReply2, setCommentReply2] = useState("");
  const [commentReply3, setCommentReply3] = useState("");
  const [delayType, setDelayType] = useState<"FIXED" | "RANDOM">("FIXED");
  const [delayValue, setDelayValue] = useState(0);
  const [delayUnit, setDelayUnit] = useState<"second" | "minute" | "hour">("second");
  const [followRequired, setFollowRequired] = useState(false);
  const [followGateMessage, setFollowGateMessage] = useState("");
  const [dmType, setDmType] = useState<"text_button" | "text_only">("text_button");
  const [optInMessage, setOptInMessage] = useState("Hey! Tap below and I will send you the access.");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi Welcome to DMDost!");
  const [buttonText, setButtonText] = useState("Get Link");
  const [buttonUrl, setButtonUrl] = useState("https://google.com");
  
  // Data loading states
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch Instagram posts for active workspace
  useEffect(() => {
    if (isOpen && activeWorkspace?.workspaceId) {
      setLoadingPosts(true);
      instagramService.getWorkspacePosts(activeWorkspace.workspaceId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setPosts(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch posts:", err);
          showToast("Failed to load Instagram posts", "error");
        })
        .finally(() => {
          setLoadingPosts(false);
        });
    }
  }, [isOpen, activeWorkspace]);

  // Load/Reset wizard data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setWizardStep(1);
      setAutoName(editingAutomation?.name || "NEW CLOUD AUTOMATION");
      setPostScope("SELECTED_POSTS");
      setSelectedPostIds([]);
      setTriggerType("COMMENT_KEYWORD");
      setKeywords([]);
      setKeywordInput("");
      setReplyToComment(false);
      setCommentReply1("");
      setCommentReply2("");
      setCommentReply3("");
      setDelayType("FIXED");
      setDelayValue(0);
      setDelayUnit("second");
      setFollowRequired(false);
      setFollowGateMessage("");
      setDmType("text_button");
      setOptInMessage("Hey! Tap below and I will send you the access.");
      setWelcomeMessage("Hi Welcome to DMDost!");
      setButtonText("Get Link");
      setButtonUrl("https://google.com");
      setLoadingDetails(false);

      if (editingAutomation) {
        const auto = editingAutomation as any;
        if (auto.postScope !== undefined) {
          setPostScope(auto.postScope || "SELECTED_POSTS");
          setSelectedPostIds(auto.postIds || []);
          setTriggerType(auto.triggerType || "COMMENT_KEYWORD");
          setKeywords(auto.keywords || ["link"]);
          setReplyToComment(auto.replyToComment ?? false);
          setCommentReply1(auto.commentReply1 || "");
          setCommentReply2(auto.commentReply2 || "");
          setCommentReply3(auto.commentReply3 || "");

          setDelayType(auto.delayType === "RANDOM" ? "RANDOM" : "FIXED");
          const delay = auto.delaySeconds || 0;
          if (delay % 3600 === 0 && delay > 0) {
            setDelayValue(delay / 3600);
            setDelayUnit("hour");
          } else if (delay % 60 === 0 && delay > 0) {
            setDelayValue(delay / 60);
            setDelayUnit("minute");
          } else {
            setDelayValue(delay);
            setDelayUnit("second");
          }

          setFollowRequired(auto.followRequired ?? false);
          setFollowGateMessage(auto.followGateMessage || "");
          setDmType(auto.buttonEnabled ? "text_button" : "text_only");
          setOptInMessage(auto.optInMessage || "Hey! Tap below and I will send you the access.");
          setWelcomeMessage(auto.welcomeMessage || "Hi Welcome to DMDost!");
          setButtonText(auto.buttonText || "Get Link");
          setButtonUrl(auto.linkUrl || "https://google.com");
        } else {
          setLoadingDetails(true);
          automationService.getCommentToDmDetails(editingAutomation.id)
            .then((res) => {
              if (res.success && res.data) {
                const details = res.data;
                setAutoName(details.name || editingAutomation.name || "NEW CLOUD AUTOMATION");
                setPostScope(details.postScope || "SELECTED_POSTS");
                setSelectedPostIds(details.postIds || []);
                setTriggerType(details.triggerType || "COMMENT_KEYWORD");
                setKeywords(details.keywords || ["link"]);
                setReplyToComment(details.replyToComment ?? false);
                setCommentReply1(details.commentReply1 || "");
                setCommentReply2(details.commentReply2 || "");
                setCommentReply3(details.commentReply3 || "");

                setDelayType(details.delayType === "RANDOM" ? "RANDOM" : "FIXED");
                const delay = details.delaySeconds || 0;
                if (delay % 3600 === 0 && delay > 0) {
                  setDelayValue(delay / 3600);
                  setDelayUnit("hour");
                } else if (delay % 60 === 0 && delay > 0) {
                  setDelayValue(delay / 60);
                  setDelayUnit("minute");
                } else {
                  setDelayValue(delay);
                  setDelayUnit("second");
                }

                setFollowRequired(details.followRequired ?? false);
                setFollowGateMessage(details.followGateMessage || "");
                setDmType(details.buttonEnabled ? "text_button" : "text_only");
                setOptInMessage(details.optInMessage || "Hey! Tap below and I will send you the access.");
                setWelcomeMessage(details.welcomeMessage || "Hi Welcome to DMDost!");
                setButtonText(details.buttonText || "Get Link");
                setButtonUrl(details.linkUrl || "https://google.com");
              }
            })
            .catch((err: any) => {
              console.error("Failed to load automation details:", err);
              setPostScope(auto.postScope || "SELECTED_POSTS");
              setSelectedPostIds(auto.postIds || []);
              setTriggerType(auto.triggerType || "COMMENT_KEYWORD");
              setKeywords(auto.keywords || ["link"]);
              setReplyToComment(auto.replyToComment ?? false);
              setCommentReply1(auto.commentReply1 || "");
              setCommentReply2(auto.commentReply2 || "");
              setCommentReply3(auto.commentReply3 || "");
              setDelayType(auto.delayType === "RANDOM" ? "RANDOM" : "FIXED");
              const delay = auto.delaySeconds || 0;
              setDelayValue(delay);
              setDelayUnit("second");
              setFollowRequired(auto.followRequired ?? false);
              setFollowGateMessage(auto.followGateMessage || "");
              setDmType(auto.buttonEnabled ? "text_button" : "text_only");
              setOptInMessage(auto.optInMessage || "Hey! Tap below and I will send you the access.");
              setWelcomeMessage(auto.welcomeMessage || "Hi Welcome to DMDost!");
              setButtonText(auto.buttonText || "Get Link");
              setButtonUrl(auto.linkUrl || "https://google.com");
            })
            .finally(() => {
              setLoadingDetails(false);
            });
        }
      }
    }
  }, [isOpen, editingAutomation]);

  const isStep1Valid = () => {
    if (postScope === "SELECTED_POSTS" && selectedPostIds.length === 0) return false;
    return true;
  };

  const isStep2Valid = () => {
    if (triggerType === "COMMENT_KEYWORD" && keywords.length === 0) return false;
    if (replyToComment && !commentReply1.trim() && !commentReply2.trim() && !commentReply3.trim()) return false;
    return true;
  };

  const isStep3Valid = () => {
    if (!optInMessage.trim()) return false;
    if (!welcomeMessage.trim()) return false;
    if (dmType === "text_button" && (!buttonText.trim() || !buttonUrl.trim())) return false;
    return true;
  };

  const handleCreateCommentToDm = async () => {
    if (!isStep2Valid() || !isStep3Valid()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsCreating(true);
    try {
      let delaySeconds = Number(delayValue);
      if (delayUnit === "minute") delaySeconds *= 60;
      else if (delayUnit === "hour") delaySeconds *= 3600;

      const payload = {
        workspaceId: activeWorkspace?.workspaceId || "ws_default",
        name: autoName,
        priority: 1,
        triggerType,
        keywords,
        postScope,
        postIds: postScope === "SELECTED_POSTS" ? selectedPostIds : [],
        replyToComment,
        commentReply1: replyToComment ? commentReply1.trim() : null,
        commentReply2: replyToComment ? commentReply2.trim() : null,
        commentReply3: replyToComment ? commentReply3.trim() : null,
        sendDm: true,
        optInMessage,
        welcomeMessage,
        buttonEnabled: dmType === "text_button",
        buttonText: dmType === "text_button" ? buttonText : "",
        linkUrl: dmType === "text_button" ? buttonUrl : "",
        followRequired,
        followGateMessage: followRequired ? followGateMessage.trim() : null,
        delayType,
        delaySeconds,
      };

      if (editingAutomation?.id) {
        console.log("Updating automation with payload:", payload);
        const res = await automationService.updateCommentToDm(editingAutomation.id, payload);

        if (res.success) {
          const updatedAuto = {
            ...editingAutomation,
            name: autoName,
            status: (res.data?.status || editingAutomation.status || "ACTIVE").toLowerCase() as any,
            trigger: triggerType === "COMMENT_KEYWORD" ? keywords.join(", ") : "Any comment",
            template: welcomeMessage,
            delay: delaySeconds,
            // Cache fields in local state
            postScope,
            postIds: postScope === "SELECTED_POSTS" ? selectedPostIds : [],
            triggerType,
            keywords,
            replyToComment,
            commentReply1: replyToComment ? commentReply1.trim() : null,
            commentReply2: replyToComment ? commentReply2.trim() : null,
            commentReply3: replyToComment ? commentReply3.trim() : null,
            optInMessage,
            welcomeMessage,
            buttonEnabled: dmType === "text_button",
            buttonText: dmType === "text_button" ? buttonText : "",
            linkUrl: dmType === "text_button" ? buttonUrl : "",
            followRequired,
            followGateMessage: followRequired ? followGateMessage.trim() : null,
            delayType,
            delaySeconds,
            updatedAt: res.data?.updatedAt || new Date().toISOString()
          };
          onSaveSuccess(updatedAuto as Automation, true);
          showToast("Comment-to-DM automation updated successfully!", "success");
        }
      } else {
        console.log("Creating automation with payload:", payload);
        const res = await automationService.createCommentToDm(payload);

        if (res.success) {
          const newAuto = {
            id: res.data?.id || `auto_${Date.now()}`,
            name: autoName,
            type: "comment_reply" as const,
            status: (res.data?.status || "ACTIVE").toLowerCase() as any,
            trigger: triggerType === "COMMENT_KEYWORD" ? keywords.join(", ") : "Any comment",
            conditions: [],
            template: welcomeMessage,
            delay: delaySeconds,
            accountId: activeWorkspace?.instagramUserId || "ig_default",
            createdAt: res.data?.createdAt || new Date().toISOString(),
            updatedAt: res.data?.createdAt || new Date().toISOString(),
            stats: { triggered: 0, sent: 0, failed: 0 },
            // Cache fields in local state
            postScope,
            postIds: postScope === "SELECTED_POSTS" ? selectedPostIds : [],
            triggerType,
            keywords,
            replyToComment,
            commentReply1: replyToComment ? commentReply1.trim() : null,
            commentReply2: replyToComment ? commentReply2.trim() : null,
            commentReply3: replyToComment ? commentReply3.trim() : null,
            optInMessage,
            welcomeMessage,
            buttonEnabled: dmType === "text_button",
            buttonText: dmType === "text_button" ? buttonText : "",
            linkUrl: dmType === "text_button" ? buttonUrl : "",
            followRequired,
            followGateMessage: followRequired ? followGateMessage.trim() : null,
            delayType,
            delaySeconds
          };
          onSaveSuccess(newAuto as Automation, false);
          showToast("Comment-to-DM automation created successfully!", "success");
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
      <DialogContent showCloseButton={false} className="max-w-2xl p-0 overflow-hidden rounded-3xl border shadow-2xl bg-card">
        <DialogDescription className="sr-only">
          Configure comment triggers, keyword filters, reply templates, and DM automation
        </DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Zap className="size-4" />
            </div>
            <DialogTitle className="font-semibold text-base text-foreground">
              {editingAutomation ? "Edit Comment-to-DM Automation" : "When someone comments on your Post/Reel"}
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
          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading automation details...</p>
            </div>
          ) : (
            <>
              {/* Step 1 */}
              {wizardStep === 1 && (
                <StepPostsScope
                  autoName={autoName}
                  setAutoName={setAutoName}
                  postScope={postScope}
                  setPostScope={setPostScope}
                  selectedPostIds={selectedPostIds}
                  setSelectedPostIds={setSelectedPostIds}
                  activeWorkspace={activeWorkspace}
                  posts={posts}
                  loadingPosts={loadingPosts}
                />
              )}

              {/* Step 2 */}
              {wizardStep === 2 && (
                <StepTriggerReplies
                  triggerType={triggerType}
                  setTriggerType={setTriggerType}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  keywordInput={keywordInput}
                  setKeywordInput={setKeywordInput}
                  replyToComment={replyToComment}
                  setReplyToComment={setReplyToComment}
                  commentReply1={commentReply1}
                  setCommentReply1={setCommentReply1}
                  commentReply2={commentReply2}
                  setCommentReply2={setCommentReply2}
                  commentReply3={commentReply3}
                  setCommentReply3={setCommentReply3}
                />
              )}

              {/* Step 3 */}
              {wizardStep === 3 && (
                <StepMessagesDelay
                  delayType={delayType}
                  setDelayType={setDelayType}
                  delayValue={delayValue}
                  setDelayValue={setDelayValue}
                  delayUnit={delayUnit}
                  setDelayUnit={setDelayUnit}
                  followRequired={followRequired}
                  setFollowRequired={setFollowRequired}
                  followGateMessage={followGateMessage}
                  setFollowGateMessage={setFollowGateMessage}
                  dmType={dmType}
                  setDmType={setDmType}
                  optInMessage={optInMessage}
                  setOptInMessage={setOptInMessage}
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                  buttonText={buttonText}
                  setButtonText={setButtonText}
                  buttonUrl={buttonUrl}
                  setButtonUrl={setButtonUrl}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loadingDetails && (
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
                  className="gradient-brand text-white border-0 hover:opacity-90 px-5 py-2 font-medium"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleCreateCommentToDm}
                  disabled={!isStep3Valid() || isCreating}
                  className="gradient-brand text-white border-0 hover:opacity-90 px-5 py-2 font-medium"
                >
                  {isCreating ? (editingAutomation ? "Saving..." : "Creating...") : (editingAutomation ? "Save Changes" : "Create Automation")}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
