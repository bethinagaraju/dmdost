import type {
  ApiResponse,
  PostReelDmAutomation,
  CreatePostReelDmRequest,
  UpdatePostReelDmRequest,
  PostReelMediaItem,
  PostReelDmMetrics,
  PostReelDmSimulationResult,
  PostReelDmExecutionLog,
  PostReelStatus,
} from "@/types";
import { apiFetch } from "./auth.service";

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

const BASE_URL = "/api/v1/automation/post-reel-dm";

export const postReelDmService = {
  /**
   * 1. Fetch connected Instagram account's posts and reels for selection
   * GET /api/v1/automation/post-reel-dm/media?workspaceId={workspaceId}
   */
  getMedia: async (workspaceId: string): Promise<ApiResponse<PostReelMediaItem[]>> => {
    const response = await apiFetch(`${BASE_URL}/media?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return parseResponse<PostReelMediaItem[]>(response, "Failed to fetch media posts");
  },

  /**
   * 2. Create a new Post/Reel DM automation
   * POST /api/v1/automation/post-reel-dm
   */
  create: async (payload: CreatePostReelDmRequest): Promise<ApiResponse<PostReelDmAutomation>> => {
    const response = await apiFetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return parseResponse<PostReelDmAutomation>(response, "Failed to create Post/Reel DM automation");
  },

  /**
   * 3. List Post/Reel DM automations for current workspace
   * GET /api/v1/automation/post-reel-dm?workspaceId={workspaceId}
   */
  getAll: async (workspaceId: string): Promise<ApiResponse<PostReelDmAutomation[]>> => {
    const response = await apiFetch(`${BASE_URL}?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return parseResponse<PostReelDmAutomation[]>(response, "Failed to fetch Post/Reel DM automations");
  },

  /**
   * 4. Get automation configuration & metrics by ID
   * GET /api/v1/automation/post-reel-dm/{id}
   */
  getById: async (id: string): Promise<ApiResponse<PostReelDmAutomation>> => {
    const response = await apiFetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return parseResponse<PostReelDmAutomation>(response, "Failed to fetch Post/Reel DM automation details");
  },

  /**
   * 5. Update automation fields, initial DM, delays, or primary DM
   * PUT /api/v1/automation/post-reel-dm/{id}
   */
  update: async (id: string, payload: UpdatePostReelDmRequest): Promise<ApiResponse<PostReelDmAutomation>> => {
    const response = await apiFetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return parseResponse<PostReelDmAutomation>(response, "Failed to update Post/Reel DM automation");
  },

  /**
   * 6. Toggle status (ACTIVE / PAUSED / DRAFT)
   * POST /api/v1/automation/post-reel-dm/{id}/status?status={status}
   */
  toggleStatus: async (
    id: string,
    status: PostReelStatus
  ): Promise<ApiResponse<{ id: string; status: PostReelStatus }>> => {
    const response = await apiFetch(`${BASE_URL}/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "POST",
    });
    return parseResponse<{ id: string; status: PostReelStatus }>(response, `Failed to update status to ${status}`);
  },

  /**
   * 7. Clone automation as a draft copy
   * POST /api/v1/automation/post-reel-dm/{id}/clone
   */
  clone: async (id: string): Promise<ApiResponse<PostReelDmAutomation>> => {
    const response = await apiFetch(`${BASE_URL}/${id}/clone`, {
      method: "POST",
    });
    return parseResponse<PostReelDmAutomation>(response, "Failed to clone Post/Reel DM automation");
  },

  /**
   * 8. Test simulation & variable preview
   * POST /api/v1/automation/post-reel-dm/{id}/test?simulatedUsername={username}
   */
  testSimulation: async (
    id: string,
    simulatedUsername: string
  ): Promise<ApiResponse<PostReelDmSimulationResult>> => {
    const response = await apiFetch(
      `${BASE_URL}/${id}/test?simulatedUsername=${encodeURIComponent(simulatedUsername)}`,
      {
        method: "POST",
      }
    );
    return parseResponse<PostReelDmSimulationResult>(response, "Failed to run simulation test");
  },

  /**
   * 9. Fetch aggregated performance analytics
   * GET /api/v1/automation/post-reel-dm/{id}/metrics
   */
  getMetrics: async (id: string): Promise<ApiResponse<PostReelDmMetrics>> => {
    const response = await apiFetch(`${BASE_URL}/${id}/metrics`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return parseResponse<PostReelDmMetrics>(response, "Failed to fetch performance metrics");
  },

  /**
   * 10. View audit logs of triggered conversations
   * GET /api/v1/automation/post-reel-dm/{id}/executions
   */
  getExecutions: async (id: string): Promise<ApiResponse<PostReelDmExecutionLog[]>> => {
    const response = await apiFetch(`${BASE_URL}/${id}/executions`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return parseResponse<PostReelDmExecutionLog[]>(response, "Failed to fetch conversation execution logs");
  },

  /**
   * 11. Soft delete an automation
   * DELETE /api/v1/automation/post-reel-dm/{id}
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiFetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return parseResponse<null>(response, "Failed to delete Post/Reel DM automation");
  },
};
