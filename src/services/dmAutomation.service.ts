import type {
  ApiResponse,
  DmAutomation,
  DmSimulationResult,
  DmAutomationMetrics,
  DmExecutionLog,
  DmStatus,
  UnifiedAutomationItem,
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

export const dmAutomationService = {
  // 1. Create DM automation (POST /api/v1/automation/dm)
  create: async (payload: Partial<DmAutomation>): Promise<ApiResponse<DmAutomation>> => {
    const response = await fetch("/api/v1/automation/dm", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return parseResponse<DmAutomation>(response, "Failed to create DM automation");
  },

  // 2. List DM automations for workspace (GET /api/v1/automation/dm?workspaceId={workspaceId})
  getAll: async (workspaceId: string): Promise<ApiResponse<DmAutomation[]>> => {
    const response = await fetch(`/api/v1/automation/dm?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<DmAutomation[]>(response, "Failed to fetch DM automations");
  },

  // 3. Get details by ID (GET /api/v1/automation/dm/{id})
  getById: async (id: string): Promise<ApiResponse<DmAutomation>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<DmAutomation>(response, "Failed to fetch DM automation details");
  },

  // 4. Update automation (PUT /api/v1/automation/dm/{id})
  update: async (id: string, payload: Partial<DmAutomation>): Promise<ApiResponse<DmAutomation>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return parseResponse<DmAutomation>(response, "Failed to update DM automation");
  },

  // 5. Toggle Status (POST /api/v1/automation/dm/{id}/status?status={status})
  toggleStatus: async (id: string, status: DmStatus): Promise<ApiResponse<{ id: string; status: DmStatus }>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return parseResponse<{ id: string; status: DmStatus }>(response, `Failed to update status to ${status}`);
  },

  // 6. Clone automation (POST /api/v1/automation/dm/{id}/clone)
  clone: async (id: string): Promise<ApiResponse<DmAutomation>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}/clone`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return parseResponse<DmAutomation>(response, "Failed to clone DM automation");
  },

  // 7. Simulation Test Preview (POST /api/v1/automation/dm/{id}/test?messageText={text}&username={username})
  testSimulation: async (id: string, messageText: string, username: string): Promise<ApiResponse<DmSimulationResult>> => {
    const response = await fetch(
      `/api/v1/automation/dm/${id}/test?messageText=${encodeURIComponent(messageText)}&username=${encodeURIComponent(username)}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    return parseResponse<DmSimulationResult>(response, "Failed to run simulation test");
  },

  // 8. Performance Analytics Metrics (GET /api/v1/automation/dm/{id}/metrics)
  getMetrics: async (id: string): Promise<ApiResponse<DmAutomationMetrics>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}/metrics`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<DmAutomationMetrics>(response, "Failed to fetch DM automation metrics");
  },

  // 9. Execution Logs (GET /api/v1/automation/dm/{id}/executions)
  getExecutions: async (id: string): Promise<ApiResponse<DmExecutionLog[]>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}/executions`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<DmExecutionLog[]>(response, "Failed to fetch execution logs");
  },

  // 10. Soft Delete Automation (DELETE /api/v1/automation/dm/{id})
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`/api/v1/automation/dm/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return parseResponse<null>(response, "Failed to delete DM automation");
  },

  // 11. Unified All Automations (GET /api/v1/automation/all?workspaceId={workspaceId})
  getAllAutomations: async (workspaceId: string): Promise<ApiResponse<UnifiedAutomationItem[]>> => {
    const response = await fetch(`/api/v1/automation/all?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: "GET",
      headers: getGetHeaders(),
    });
    return parseResponse<UnifiedAutomationItem[]>(response, "Failed to fetch all automations");
  },
};
