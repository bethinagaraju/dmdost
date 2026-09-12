export type StoryReplyTriggerType = "ANY_REPLY" | "KEYWORD_MATCH";
export type StoryReplyFollowerCondition = "NONE" | "FOLLOW_REQUIRED" | "FOLLOW_GATE" | "FOLLOWING_ONLY";
export type StoryReplyAutomationStatus = "ACTIVE" | "PAUSED" | "DRAFT";
export type StoryScope = "ALL_STORIES" | "SELECTED_STORIES";

export interface StoryReplyDmAutomation {
  id: string;
  workspaceId: string;
  name: string;
  priority: number;
  storyScope: StoryScope;
  storyIds: string[];
  triggerType: StoryReplyTriggerType;
  keywords: string[];
  initialMessageText: string;
  ctaButtonText: string;
  initialDelaySeconds: number;
  primaryMessageText: string;
  primaryButtonEnabled: boolean;
  primaryButtonText: string;
  primaryButtonUrl: string;
  primaryDelaySeconds: number;
  followerCondition: StoryReplyFollowerCondition;
  followGateMessage?: string;
  businessHoursEnabled: boolean;
  status: StoryReplyAutomationStatus;
  deduplicationEnabled: boolean;
  deduplicationHours?: number;
  createdAt?: string;
  updatedAt?: string;

  // Added stats mapping
  metrics?: {
    automationId: string;
    workspaceId: string;
    repliesReceived: number;
    initialDmsSent: number;
    ctaClicks: number;
    primaryDmsSent: number;
    uniqueUsers: number;
    followersGained: number;
  };
  followersGained?: number;
  runs?: number;
  buttonClicks?: number;
  dmsSent?: number;
  commentsSent?: number;
}

export interface CreateStoryReplyDmAutomationRequest {
  workspaceId: string;
  name: string;
  priority: number;
  storyScope: StoryScope;
  storyIds: string[];
  triggerType: StoryReplyTriggerType;
  keywords: string[];
  initialMessageText: string;
  ctaButtonText: string;
  initialDelaySeconds: number;
  primaryMessageText: string;
  primaryButtonEnabled: boolean;
  primaryButtonText: string;
  primaryButtonUrl: string;
  primaryDelaySeconds: number;
  followerCondition: StoryReplyFollowerCondition;
  followGateMessage?: string;
  businessHoursEnabled: boolean;
  deduplicationEnabled: boolean;
  deduplicationHours?: number;
}

export type UpdateStoryReplyDmAutomationRequest = Partial<CreateStoryReplyDmAutomationRequest>;
