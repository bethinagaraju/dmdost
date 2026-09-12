export type PostReelFollowerCondition = "NONE" | "FOLLOW_REQUIRED" | "FOLLOW_GATE";
export type PostReelStatus = "ACTIVE" | "DRAFT" | "PAUSED" | "INACTIVE";

export interface PostReelMediaItem {
  id: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "REEL" | "CAROUSEL_ALBUM" | string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
  timestamp?: string;
}

export interface PostReelDmMetrics {
  automationId?: string;
  workspaceId?: string;
  sharesReceived: number;
  initialDmsSent: number;
  ctaClicks: number;
  primaryDmsSent: number;
  uniqueUsers: number;
  followersGained: number;
  conversionRate: number;
}

export interface PostReelDmAutomation {
  id: string;
  workspaceId: string;
  name: string;
  mediaId: string;
  mediaUrl?: string;
  mediaPermalink?: string;
  mediaThumbnailUrl?: string;
  mediaType?: "POST" | "REEL" | "VIDEO" | "CAROUSEL_ALBUM" | string;
  mediaCaption?: string;

  // Stage 1: Initial DM & CTA Button & Delay
  initialMessageText: string;
  ctaButtonText: string;
  initialDelaySeconds: number;

  // Stage 2: Primary DM & Link & Delay
  primaryMessageText: string;
  primaryButtonEnabled?: boolean;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryDelaySeconds: number;

  // Follower Gate & Business Rules
  followerCondition?: PostReelFollowerCondition;
  followGateMessage?: string | null;

  businessHoursEnabled?: boolean;
  businessStartTime?: string | null;
  businessEndTime?: string | null;
  businessDays?: string[];
  offlineMessage?: string | null;

  deduplicationEnabled?: boolean;
  deduplicationHours?: number;

  status: PostReelStatus;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;

  // Metrics summary
  sharesReceived?: number;
  initialDmsSent?: number;
  ctaClicks?: number;
  primaryDmsSent?: number;
  conversionRate?: number;
  uniqueUsers?: number;
  followersGained?: number;
  metrics?: PostReelDmMetrics;
}

export interface CreatePostReelDmRequest {
  workspaceId: string;
  name: string;
  mediaId: string;
  mediaUrl?: string;
  mediaPermalink?: string;
  mediaThumbnailUrl?: string;
  mediaType?: string;
  mediaCaption?: string;
  initialMessageText: string;
  ctaButtonText: string;
  initialDelaySeconds?: number;
  primaryMessageText: string;
  primaryButtonEnabled?: boolean;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryDelaySeconds?: number;
  followerCondition?: PostReelFollowerCondition;
  followGateMessage?: string | null;
  businessHoursEnabled?: boolean;
  businessStartTime?: string | null;
  businessEndTime?: string | null;
  businessDays?: string[];
  offlineMessage?: string | null;
  deduplicationEnabled?: boolean;
  deduplicationHours?: number;
}

export interface UpdatePostReelDmRequest extends Partial<CreatePostReelDmRequest> {}

export interface PostReelDmSimulationResult {
  automationId: string;
  automationName: string;
  mediaId: string;
  simulatedUsername: string;
  mediaMatched: boolean;
  withinBusinessHours: boolean;
  renderedInitialMessage: string;
  ctaButtonText: string;
  initialDelaySeconds: number;
  renderedPrimaryMessage: string;
  primaryButtonEnabled: boolean;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryDelaySeconds: number;
}

export interface PostReelDmExecutionLog {
  id: string;
  automationId: string;
  workspaceId: string;
  instagramUserId: string;
  instagramUsername: string;
  sharedMediaId: string;
  sharedMediaUrl?: string;
  incomingMessageId: string;
  state: "INITIAL_DM_SENT" | "COMPLETED" | "DUPLICATE" | "SKIPPED" | "FAILED" | string;
  initialSentAt?: string | null;
  ctaClickedAt?: string | null;
  primarySentAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}
