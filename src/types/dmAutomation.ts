export type DmTriggerType = "KEYWORD" | "ANY_DM" | "QUESTION";
export type DmMatchMode = "CONTAINS" | "EXACT" | "STARTS_WITH" | "ENDS_WITH";
export type DmFollowerCondition = "NONE" | "FOLLOW_REQUIRED" | "FOLLOW_GATE";
export type DmStatus = "ACTIVE" | "DRAFT" | "PAUSED" | "INACTIVE";

export interface DmMessageStep {
  id?: string;
  stepOrder: number;
  messageText: string;
  delaySeconds: number;
  buttonEnabled: boolean;
  buttonType?: "WEB_URL" | "POSTBACK" | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  buttonPayload?: string | null;
}

export interface DmAutomation {
  id: string;
  workspaceId: string;
  name: string;
  priority?: number;
  triggerType: DmTriggerType;
  matchMode?: DmMatchMode;
  caseSensitive?: boolean;
  keywords?: string[];
  followerCondition?: DmFollowerCondition;
  followGateMessage?: string | null;
  messageSteps: DmMessageStep[];
  businessHoursEnabled?: boolean;
  businessStartTime?: string | null;
  businessEndTime?: string | null;
  businessDays?: string[];
  offlineMessage?: string | null;
  deduplicationEnabled?: boolean;
  deduplicationHours?: number;
  status: DmStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  // Metrics summary
  runs?: number;
  dmsSent?: number;
  failed?: number;
  uniqueUsers?: number;
  buttonClicks?: number;
  stepsCount?: number;
}

export interface DmSimulationResult {
  automationId: string;
  automationName: string;
  matched: boolean;
  simulatedUser: string;
  simulatedInputText: string;
  simulatedSteps: DmMessageStep[];
  followCheckPassed: boolean;
  withinBusinessHours: boolean;
  renderedPreviewMessage: string;
}

export interface DmAutomationMetrics {
  automationId: string;
  workspaceId: string;
  runs: number;
  dmsSent: number;
  failed: number;
  uniqueUsers: number;
  buttonClicks: number;
  followPrompts?: number;
  conversions?: number;
  updatedAt: string;
}

export interface DmExecutionLog {
  id: string;
  automationId: string;
  workspaceId: string;
  instagramUserId: string;
  instagramUsername: string;
  incomingMessageId: string;
  incomingMessageText: string;
  matchedKeyword?: string | null;
  messagesSentCount: number;
  status: "SUCCESS" | "DUPLICATE" | "SKIPPED" | "FAILED";
  errorMessage?: string | null;
  executedAt: string;
}

export interface UnifiedAutomationItem {
  id: string;
  name: string;
  type: "COMMENT_TO_DM" | "DM_AUTOMATION";
  triggerType: string;
  status: "ACTIVE" | "PAUSED" | "DRAFT" | "INACTIVE";
  runs?: number;
  dmsSent?: number;
  commentsSent?: number;
  failed?: number;
  uniqueUsers?: number;
  buttonClicks?: number;
  stepsCount?: number;
  createdAt: string;
  updatedAt?: string;
  raw?: any;
}
