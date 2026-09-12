import type {
  ApiResponse,
  StoryReplyDmAutomation,
  CreateStoryReplyDmAutomationRequest,
  UpdateStoryReplyDmAutomationRequest,
  StoryReplyAutomationStatus,
} from "@/types";

const getAuthHeaders = () => {
  const token = localStorage.getItem("dmdost_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

const getGetHeaders = () => {
  const token = localStorage.getItem("dmdost_token");
  return {
    "Authorization": `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };
};

async function parseResponse<T = any>(response: Response, defaultError: string): Promise<ApiResponse<T>> {
  const text = await response.text();
  let data: any = null;
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `${defaultError} (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  if (!data) {
    return { success: true, message: "Success", data: null as any };
  }

  if (data.success === false) {
    throw new Error(data.message || defaultError);
  }

  return data;
}

export const storyReplyDmAutomationService = {
  create: async (payload: CreateStoryReplyDmAutomationRequest): Promise<ApiResponse<StoryReplyDmAutomation>> => {
    const response = await fetch("/api/v1/automation/story-reply-dm", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return parseResponse<StoryReplyDmAutomation>(response, "Failed to create Story Reply automation");
  },

  getAll: async (workspaceId: string): Promise<ApiResponse<StoryReplyDmAutomation[]>> => {
    const response = await fetch(`/api/v1/automation/story-reply-dm?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<StoryReplyDmAutomation[]>(response, "Failed to fetch Story Reply automations");
  },

  update: async (id: string, payload: UpdateStoryReplyDmAutomationRequest): Promise<ApiResponse<StoryReplyDmAutomation>> => {
    const response = await fetch(`/api/v1/automation/story-reply-dm/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return parseResponse<StoryReplyDmAutomation>(response, "Failed to update Story Reply automation");
  },

  toggleStatus: async (id: string, status: StoryReplyAutomationStatus): Promise<ApiResponse<{ id: string; status: StoryReplyAutomationStatus }>> => {
    const response = await fetch(`/api/v1/automation/story-reply-dm/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return parseResponse<{ id: string; status: StoryReplyAutomationStatus }>(response, `Failed to update status to ${status}`);
  },

  clone: async (id: string): Promise<ApiResponse<StoryReplyDmAutomation>> => {
    const response = await fetch(`/api/v1/automation/story-reply-dm/${id}/clone`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return parseResponse<StoryReplyDmAutomation>(response, "Failed to clone Story Reply automation");
  },

  getStories: async (workspaceId: string): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`/api/v1/automation/story-reply-dm/stories?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<any[]>(response, "Failed to fetch Instagram Stories");
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`/api/v1/automation/story-reply-dm/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return parseResponse<void>(response, "Failed to delete Story Reply automation");
  },
};
