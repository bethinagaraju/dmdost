import {
  MOCK_USER,
  MOCK_INSTAGRAM_ACCOUNTS,
  MOCK_AUTOMATIONS,
  MOCK_TEMPLATES,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_COMMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITY_LOGS,
  MOCK_SUBSCRIPTION,
  MOCK_INVOICES,
  MOCK_ANALYTICS,
  MOCK_DASHBOARD_STATS,
  MOCK_SUPPORT_TICKETS,
} from "@/constants/mockData";
import type {
  User,
  InstagramAccount,
  Automation,
  DmTemplate,
  Conversation,
  Message,
  Comment,
  Notification,
  ActivityLog,
  Subscription,
  Invoice,
  AnalyticsData,
  DashboardStats,
  SupportTicket,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function ok<T>(data: T, message = "Success"): ApiResponse<T> {
  return { data, message, success: true };
}

export { authService } from "./auth.service";

export const userService = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    await delay(400);
    return ok(MOCK_USER);
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    await delay(600);
    return ok({ ...MOCK_USER, ...data });
  },

  changePassword: async (_current: string, _newPassword: string): Promise<ApiResponse<null>> => {
    await delay(700);
    return ok(null, "Password changed");
  },

  deleteAccount: async (): Promise<ApiResponse<null>> => {
    await delay(1000);
    return ok(null, "Account deletion initiated");
  },
};

export const instagramService = {
  getStatus: async (): Promise<ApiResponse<{ connected: boolean; username: string | null }>> => {
    const token = localStorage.getItem("instaautodm_token");
    const response = await fetch("/api/v1/instagram/status", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch status");
    }
    return data;
  },

  getAccounts: async (): Promise<ApiResponse<InstagramAccount[]>> => {
    await delay(500);
    return ok(MOCK_INSTAGRAM_ACCOUNTS);
  },

  connectAccount: async (): Promise<ApiResponse<{ authorizationUrl: string }>> => {
    const token = localStorage.getItem("instaautodm_token");
    const response = await fetch("/api/v1/instagram/connect", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to generate authorization URL");
    }
    return data;
  },

  disconnectAccount: async (id?: string): Promise<ApiResponse<null>> => {
    const token = localStorage.getItem("instaautodm_token");
    const response = await fetch("/api/v1/instagram/disconnect", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to disconnect account");
    }
    return data;
  },

  refreshToken: async (id: string): Promise<ApiResponse<null>> => {
    await delay(600);
    console.log("Refreshing token for:", id);
    return ok(null, "Token refreshed");
  },
};

export const automationService = {
  getAll: async (): Promise<PaginatedResponse<Automation>> => {
    await delay(500);
    return {
      data: MOCK_AUTOMATIONS,
      total: MOCK_AUTOMATIONS.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Automation>> => {
    await delay(300);
    const automation = MOCK_AUTOMATIONS.find((a) => a.id === id);
    if (!automation) throw new Error("Automation not found");
    return ok(automation);
  },

  create: async (data: Partial<Automation>): Promise<ApiResponse<Automation>> => {
    await delay(700);
    const newAutomation: Automation = {
      id: `auto_${Date.now()}`,
      name: data.name ?? "New Automation",
      type: data.type ?? "keyword_dm",
      status: "inactive",
      trigger: data.trigger ?? "",
      conditions: data.conditions ?? [],
      template: data.template ?? "",
      delay: data.delay ?? 0,
      accountId: data.accountId ?? "ig_01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { triggered: 0, sent: 0, failed: 0 },
    };
    return ok(newAutomation, "Automation created");
  },

  update: async (id: string, data: Partial<Automation>): Promise<ApiResponse<Automation>> => {
    await delay(600);
    const automation = MOCK_AUTOMATIONS.find((a) => a.id === id);
    if (!automation) throw new Error("Automation not found");
    return ok({ ...automation, ...data, updatedAt: new Date().toISOString() }, "Automation updated");
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    await delay(400);
    console.log("Deleting automation:", id);
    return ok(null, "Automation deleted");
  },

  toggle: async (id: string, status: "active" | "inactive"): Promise<ApiResponse<Automation>> => {
    await delay(300);
    const automation = MOCK_AUTOMATIONS.find((a) => a.id === id);
    if (!automation) throw new Error("Not found");
    return ok({ ...automation, status }, `Automation ${status}`);
  },
};

export const templateService = {
  getAll: async (): Promise<ApiResponse<DmTemplate[]>> => {
    await delay(400);
    return ok(MOCK_TEMPLATES);
  },

  create: async (data: Partial<DmTemplate>): Promise<ApiResponse<DmTemplate>> => {
    await delay(600);
    const tpl: DmTemplate = {
      id: `tpl_${Date.now()}`,
      name: data.name ?? "New Template",
      content: data.content ?? "",
      variables: data.variables ?? [],
      type: data.type ?? "dm",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return ok(tpl, "Template created");
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    await delay(300);
    console.log("Deleting template:", id);
    return ok(null, "Template deleted");
  },
};

export const messageService = {
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    await delay(500);
    return ok(MOCK_CONVERSATIONS);
  },

  getMessages: async (conversationId: string): Promise<ApiResponse<Message[]>> => {
    await delay(300);
    return ok(MOCK_MESSAGES.filter((m) => m.conversationId === conversationId));
  },

  send: async (conversationId: string, content: string): Promise<ApiResponse<Message>> => {
    await delay(500);
    const msg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: "ig_01",
      senderName: "alexjohnson_official",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ig1",
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
      isAutomated: false,
    };
    return ok(msg, "Message sent");
  },

  sendMessage: async (conversationId: string, content: string): Promise<ApiResponse<Message>> => {
    await delay(500);
    const msg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: "ig_01",
      senderName: "alexjohnson_official",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ig1",
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
      isAutomated: false,
    };
    return ok(msg, "Message sent");
  },
};

export const commentService = {
  getAll: async (): Promise<ApiResponse<Comment[]>> => {
    await delay(400);
    return ok(MOCK_COMMENTS);
  },

  reply: async (id: string, _content: string): Promise<ApiResponse<null>> => {
    await delay(400);
    console.log("Replying to comment:", id);
    return ok(null, "Reply posted");
  },

  ignore: async (id: string): Promise<ApiResponse<null>> => {
    await delay(200);
    console.log("Ignoring comment:", id);
    return ok(null, "Comment ignored");
  },
};

export const notificationService = {
  getAll: async (): Promise<ApiResponse<Notification[]>> => {
    await delay(300);
    return ok(MOCK_NOTIFICATIONS);
  },

  markRead: async (id: string): Promise<ApiResponse<null>> => {
    await delay(200);
    console.log("Marking notification as read:", id);
    return ok(null);
  },

  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    await delay(200);
    console.log("Marking notification as read:", id);
    return ok(null);
  },

  markAllRead: async (): Promise<ApiResponse<null>> => {
    await delay(300);
    return ok(null, "All notifications marked as read");
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    await delay(300);
    return ok(null, "All notifications marked as read");
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    await delay(200);
    console.log("Deleting notification:", id);
    return ok(null);
  },
};

export const activityService = {
  getLogs: async (): Promise<ApiResponse<ActivityLog[]>> => {
    await delay(400);
    return ok(MOCK_ACTIVITY_LOGS);
  },
};

export const subscriptionService = {
  get: async (): Promise<ApiResponse<Subscription>> => {
    await delay(400);
    return ok(MOCK_SUBSCRIPTION);
  },

  upgrade: async (planId: string): Promise<ApiResponse<Subscription>> => {
    await delay(800);
    return ok({ ...MOCK_SUBSCRIPTION, plan: planId as Subscription["plan"] }, "Subscription upgraded");
  },

  cancel: async (): Promise<ApiResponse<null>> => {
    await delay(500);
    return ok(null, "Subscription cancelled");
  },
};

export const billingService = {
  getInvoices: async (): Promise<ApiResponse<Invoice[]>> => {
    await delay(400);
    return ok(MOCK_INVOICES);
  },

  downloadInvoice: async (id: string): Promise<ApiResponse<null>> => {
    await delay(500);
    console.log("Downloading invoice:", id);
    return ok(null, "Invoice downloaded");
  },

  updatePaymentMethod: async (_data: Record<string, string>): Promise<ApiResponse<null>> => {
    await delay(800);
    return ok(null, "Payment method updated");
  },
};

export const analyticsService = {
  get: async (_period: string): Promise<ApiResponse<AnalyticsData[]>> => {
    await delay(500);
    return ok(MOCK_ANALYTICS);
  },

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    await delay(300);
    return ok(MOCK_DASHBOARD_STATS);
  },
};

export const supportService = {
  getTickets: async (): Promise<ApiResponse<SupportTicket[]>> => {
    await delay(400);
    return ok(MOCK_SUPPORT_TICKETS);
  },

  createTicket: async (data: { subject: string; message: string; priority: string }): Promise<ApiResponse<SupportTicket>> => {
    await delay(700);
    const ticket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      subject: data.subject,
      status: "open",
      priority: data.priority as SupportTicket["priority"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "usr_01",
      userName: "Alex Johnson",
    };
    return ok(ticket, "Ticket created");
  },
};
