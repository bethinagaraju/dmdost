export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  plan: "free" | "starter" | "professional" | "enterprise";
  createdAt: string;
  instagramAccounts: number;
}

export interface InstagramAccount {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  following: number;
  posts: number;
  isConnected: boolean;
  tokenStatus: "valid" | "expired" | "revoked";
  connectedAt: string;
  permissions: string[];
}

export interface WorkspaceAnalytics {
  workspaceId: string;
  totalDmsSent: number;
  totalCommentsSent: number;
  totalFollowersGained: number;
  totalRuns: number;
  activeAutomationsCount: number;
  totalAutomationsCount: number;
  totalButtonClicks: number;
}

export interface Automation {
  id: string;
  name: string;
  type: AutomationType;
  status: "active" | "inactive" | "paused";
  trigger: string;
  conditions: AutomationCondition[];
  template: string;
  schedule?: AutomationSchedule;
  delay: number;
  accountId: string;
  createdAt: string;
  updatedAt: string;
  followersGained?: number;
  runs?: number;
  buttonClicks?: number;
  dmsSent?: number;
  commentsSent?: number;
  metrics?: {
    automationId?: string;
    followersGained?: number;
    runs?: number;
    buttonClicks?: number;
    dmsSent?: number;
    commentsSent?: number;
  };
  stats: {
    runs?: number;
    followersGained?: number;
    buttonClicks?: number;
    triggered: number;
    sent: number;
    commentsSent?: number;
    failed: number;
  };
  optInMessage?: string;
  welcomeMessage?: string;
  buttonEnabled?: boolean;
  buttonText?: string;
  linkUrl?: string;
  followRequired?: boolean;
  followGateMessage?: string;
  delayType?: "FIXED" | "RANDOM" | null;
  delaySeconds?: number;
  raw?: any;
  isDmAutomation?: boolean;
}

export type AutomationType =
  | "keyword_dm"
  | "comment_reply"
  | "follow_check"
  | "welcome_dm"
  | "story_reply"
  | "live_reply"
  | "post_reel_dm";

export interface AutomationCondition {
  field: string;
  operator: string;
  value: string;
}

export interface AutomationSchedule {
  timezone: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface DmTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  type: "dm" | "comment";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isAutomated: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  accountId: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  replyStatus: "pending" | "replied" | "ignored";
  matchedKeyword?: string;
  automationId?: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
  status: "success" | "failed" | "pending";
}

export interface Subscription {
  id: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  usage: {
    automations: { used: number; limit: number };
    messages: { used: number; limit: number };
    accounts: { used: number; limit: number };
  };
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  date: string;
  pdfUrl?: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  features: string[];
  limits: {
    automations: number | "unlimited";
    messages: number | "unlimited";
    accounts: number | "unlimited";
    teamMembers: number | "unlimited";
  };
  popular?: boolean;
  color: string;
}

export interface AnalyticsData {
  date: string;
  messagesSent: number;
  commentsReplied: number;
  followersGained: number;
  automationsTriggered: number;
}

export interface DashboardStats {
  totalAutomations: number;
  activeAutomations: number;
  messagesSent: number;
  commentsReplied: number;
  followersGained: number;
  connectedAccounts: number;
  successRate: number;
  monthlyUsage: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
}

export * from "./dmAutomation";
export * from "./postReelDmAutomation";
