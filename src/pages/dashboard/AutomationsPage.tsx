import { useState, useEffect } from "react";
import { automationService, dmAutomationService, postReelDmService, storyReplyDmAutomationService } from "@/services";
import { MOCK_AUTOMATIONS } from "@/constants/mockData";
import { showToast } from "@/hooks";
import type { Automation, WorkspaceAnalytics } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { AutomationHeader } from "@/components/dashboard/AutomationHeader";
import { AutomationFilters } from "@/components/dashboard/AutomationFilters";
import { AutomationList } from "@/components/dashboard/AutomationList";
import { AutomationWizardDialog } from "@/components/dashboard/AutomationWizardDialog";
import { AutomationTypeDialog } from "@/components/dashboard/AutomationTypeDialog";
import { DmAutomationWizardDialog } from "@/components/dashboard/dmWizard/DmAutomationWizardDialog";
import { DmTestSimulatorDialog } from "@/components/dashboard/dm/DmTestSimulatorDialog";
import { DmExecutionsDialog } from "@/components/dashboard/dm/DmExecutionsDialog";
import { DmMetricsDialog } from "@/components/dashboard/dm/DmMetricsDialog";
import { PostReelDmWizardDialog } from "@/components/dashboard/postReelWizard/PostReelDmWizardDialog";
import { PostReelDmTestSimulatorDialog } from "@/components/dashboard/postReel/PostReelDmTestSimulatorDialog";
import { PostReelDmMetricsDialog } from "@/components/dashboard/postReel/PostReelDmMetricsDialog";
import { PostReelDmExecutionsDialog } from "@/components/dashboard/postReel/PostReelDmExecutionsDialog";
import { StoryReplyWizardDialog } from "@/components/dashboard/storyReplyWizard/StoryReplyWizardDialog";

export default function AutomationsPage() {
  const { activeWorkspace } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [workspaceAnalytics, setWorkspaceAnalytics] = useState<WorkspaceAnalytics | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingAutomations, setLoadingAutomations] = useState(false);

  // Dialog states
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showCommentWizard, setShowCommentWizard] = useState(false);
  const [showDmWizard, setShowDmWizard] = useState(false);
  const [showPostReelWizard, setShowPostReelWizard] = useState(false);
  const [showStoryReplyWizard, setShowStoryReplyWizard] = useState(false);

  const [editingCommentAuto, setEditingCommentAuto] = useState<Automation | null>(null);
  const [editingDmAuto, setEditingDmAuto] = useState<any | null>(null);
  const [editingPostReelAuto, setEditingPostReelAuto] = useState<any | null>(null);
  const [editingStoryReplyAuto, setEditingStoryReplyAuto] = useState<any | null>(null);

  // Tool / Simulation / Logs / Metrics modals (Comment & DM)
  const [testAutomation, setTestAutomation] = useState<Automation | null>(null);
  const [executionsAutomation, setExecutionsAutomation] = useState<Automation | null>(null);
  const [metricsAutomation, setMetricsAutomation] = useState<Automation | null>(null);

  // Post/Reel Specific Modals
  const [testPostReelAuto, setTestPostReelAuto] = useState<Automation | null>(null);
  const [executionsPostReelAuto, setExecutionsPostReelAuto] = useState<Automation | null>(null);
  const [metricsPostReelAuto, setMetricsPostReelAuto] = useState<Automation | null>(null);

  const fetchAllAutomations = async () => {
    if (!activeWorkspace?.workspaceId) return;
    setLoadingAutomations(true);

    try {
      // Fetch Workspace Analytics
      automationService.getWorkspaceAnalytics(activeWorkspace.workspaceId)
        .then((res) => {
          if (res.success && res.data) {
            setWorkspaceAnalytics(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch workspace analytics:", err);
        });

      // Fetch Comment-to-DM, DM Automations, Post/Reel DM Automations, and Story Reply Automations concurrently
      const [commentRes, dmRes, postReelRes, storyReplyRes] = await Promise.allSettled([
        automationService.getCommentToDm(activeWorkspace.workspaceId),
        dmAutomationService.getAll(activeWorkspace.workspaceId),
        postReelDmService.getAll(activeWorkspace.workspaceId),
        storyReplyDmAutomationService.getAll(activeWorkspace.workspaceId),
      ]);

      const combined: Automation[] = [];

      // 1. Comment-to-DM
      if (commentRes.status === "fulfilled" && commentRes.value.success && Array.isArray(commentRes.value.data)) {
        commentRes.value.data.forEach((item: any) => {
          const followersGained = item.followersGained ?? item.metrics?.followersGained ?? 0;
          const runs = item.runs ?? item.metrics?.runs ?? item.runCount ?? 0;
          const buttonClicks = item.buttonClicks ?? item.metrics?.buttonClicks ?? item.clicks ?? 0;
          const dmsSent = item.dmsSent ?? item.metrics?.dmsSent ?? item.stats?.sent ?? 0;
          const commentsSent = item.commentsSent ?? item.metrics?.commentsSent ?? 0;

          combined.push({
            id: item.id,
            name: item.name,
            type: "comment_reply" as const,
            status: (item.status || "active").toLowerCase() as any,
            trigger: "Comment trigger",
            conditions: [],
            template: "",
            delay: item.delaySeconds ?? item.delay ?? 0,
            delayType: item.delayType || "FIXED",
            delaySeconds: item.delaySeconds ?? 0,
            accountId: activeWorkspace.instagramUserId || "ig_default",
            createdAt: item.createdAt,
            updatedAt: item.createdAt,
            followersGained,
            runs,
            buttonClicks,
            dmsSent,
            commentsSent,
            metrics: {
              automationId: item.id,
              followersGained,
              runs,
              buttonClicks,
              dmsSent,
              commentsSent,
            },
            stats: {
              runs,
              followersGained,
              buttonClicks,
              sent: dmsSent,
              commentsSent,
              triggered: runs,
              failed: item.stats?.failed ?? 0,
            },
            raw: item,
            isDmAutomation: false,
          });
        });
      }

      // 2. DM Automations
      if (dmRes.status === "fulfilled" && dmRes.value.success && Array.isArray(dmRes.value.data)) {
        dmRes.value.data.forEach((item: any) => {
          const runs = item.runs ?? 0;
          const dmsSent = item.dmsSent ?? 0;
          const buttonClicks = item.buttonClicks ?? 0;
          const failed = item.failed ?? 0;

          combined.push({
            id: item.id,
            name: item.name,
            type: "keyword_dm" as const,
            status: (item.status || "active").toLowerCase() as any,
            trigger: item.keywords?.length ? item.keywords.join(", ") : "Direct Message",
            conditions: [],
            template: "",
            delay: 0,
            delayType: "FIXED",
            delaySeconds: 0,
            accountId: activeWorkspace.instagramUserId || "ig_default",
            createdAt: item.createdAt,
            updatedAt: item.updatedAt || item.createdAt,
            followersGained: 0,
            runs,
            buttonClicks,
            dmsSent,
            commentsSent: 0,
            metrics: {
              automationId: item.id,
              runs,
              buttonClicks,
              dmsSent,
              commentsSent: 0,
            },
            stats: {
              runs,
              followersGained: 0,
              buttonClicks,
              sent: dmsSent,
              commentsSent: 0,
              triggered: runs,
              failed,
            },
            raw: item,
            isDmAutomation: true,
          });
        });
      }

      // 3. Post/Reel DM Automations
      if (postReelRes.status === "fulfilled" && postReelRes.value.success && Array.isArray(postReelRes.value.data)) {
        postReelRes.value.data.forEach((item: any) => {
          const sharesReceived = item.sharesReceived ?? item.metrics?.sharesReceived ?? 0;
          const initialDms = item.initialDmsSent ?? item.metrics?.initialDmsSent ?? 0;
          const primaryDms = item.primaryDmsSent ?? item.metrics?.primaryDmsSent ?? 0;
          const totalDms = initialDms + primaryDms;
          const ctaClicks = item.ctaClicks ?? item.metrics?.ctaClicks ?? 0;
          const followersGained = item.followersGained ?? item.metrics?.followersGained ?? 0;

          combined.push({
            id: item.id,
            name: item.name,
            type: "post_reel_dm" as const,
            status: (item.status || "active").toLowerCase() as any,
            trigger: `Share Reel (${item.mediaType || "Post"})`,
            conditions: [],
            template: "",
            delay: item.initialDelaySeconds ?? 0,
            delayType: "FIXED",
            delaySeconds: item.initialDelaySeconds ?? 0,
            accountId: activeWorkspace.instagramUserId || "ig_default",
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
            followersGained,
            runs: sharesReceived,
            buttonClicks: ctaClicks,
            dmsSent: totalDms,
            commentsSent: 0,
            metrics: {
              automationId: item.id,
              followersGained,
              runs: sharesReceived,
              buttonClicks: ctaClicks,
              dmsSent: totalDms,
              commentsSent: 0,
            },
            stats: {
              runs: sharesReceived,
              followersGained,
              buttonClicks: ctaClicks,
              sent: totalDms,
              commentsSent: 0,
              triggered: sharesReceived,
              failed: 0,
            },
            raw: { ...item, isPostReelDm: true },
            isDmAutomation: false,
          });
        });
      }

      // 4. Story Reply Automations
      if (storyReplyRes.status === "fulfilled" && storyReplyRes.value.success && Array.isArray(storyReplyRes.value.data)) {
        storyReplyRes.value.data.forEach((item: any) => {
          combined.push({
            id: item.id,
            name: item.name,
            type: "story_reply" as const,
            status: (item.status || "active").toLowerCase() as any,
            trigger: item.triggerType === "KEYWORD_MATCH" ? `Story Reply (${item.keywords?.join(", ")})` : "Any Story Reply",
            conditions: [],
            template: "",
            delay: item.initialDelaySeconds ?? 0,
            delayType: "FIXED",
            delaySeconds: item.initialDelaySeconds ?? 0,
            accountId: activeWorkspace.instagramUserId || "ig_default",
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
            followersGained: item.followersGained ?? 0,
            runs: item.runs ?? 0,
            buttonClicks: item.buttonClicks ?? 0,
            dmsSent: item.dmsSent ?? 0,
            commentsSent: item.commentsSent ?? 0,
            stats: {
              runs: item.runs ?? 0,
              followersGained: item.followersGained ?? 0,
              buttonClicks: item.buttonClicks ?? 0,
              sent: item.dmsSent ?? 0,
              commentsSent: item.commentsSent ?? 0,
              triggered: item.runs ?? 0,
              failed: 0,
            },
            raw: { ...item, isStoryReply: true },
            isDmAutomation: false,
          });
        });
      }

      setAutomations(combined.length > 0 ? combined : MOCK_AUTOMATIONS);
    } catch (err) {
      console.error("Failed to load automations:", err);
      setAutomations(MOCK_AUTOMATIONS);
    } finally {
      setLoadingAutomations(false);
    }
  };

  useEffect(() => {
    fetchAllAutomations();
  }, [activeWorkspace]);

  // Aggregate workspace metrics fallback
  const computedAnalytics: WorkspaceAnalytics = workspaceAnalytics || {
    workspaceId: activeWorkspace?.workspaceId || "ws_default",
    totalDmsSent: automations.reduce((acc, a) => acc + (a.dmsSent ?? a.stats?.sent ?? 0), 0),
    totalCommentsSent: automations.reduce((acc, a) => acc + (a.commentsSent ?? a.stats?.commentsSent ?? 0), 0),
    totalFollowersGained: automations.reduce((acc, a) => acc + (a.followersGained ?? a.stats?.followersGained ?? 0), 0),
    totalRuns: automations.reduce((acc, a) => acc + (a.runs ?? a.stats?.runs ?? a.stats?.triggered ?? 0), 0),
    activeAutomationsCount: automations.filter((a) => a.status === "active").length,
    totalAutomationsCount: automations.length,
    totalButtonClicks: automations.reduce((acc, a) => acc + (a.buttonClicks ?? a.stats?.buttonClicks ?? 0), 0),
  };

  const filtered = automations.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || a.type === filterType;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const isPostReelAuto = (auto: any) => {
    return auto.type === "post_reel_dm" || auto.raw?.isPostReelDm || auto.raw?.mediaId;
  };

  const isStoryReplyAuto = (auto: any) => {
    return auto.type === "story_reply" || auto.raw?.isStoryReply;
  };

  const isDmAuto = (auto: any) => {
    return (
      !isPostReelAuto(auto) && !isStoryReplyAuto(auto) &&
      (auto.isDmAutomation || auto.type === "keyword_dm" || auto.raw?.type === "DM_AUTOMATION")
    );
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    const auto = automations.find((a) => a.id === id);
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      if (auto && isPostReelAuto(auto)) {
        await postReelDmService.toggleStatus(id, newStatus === "active" ? "ACTIVE" : "PAUSED");
      } else if (auto && isStoryReplyAuto(auto)) {
        await storyReplyDmAutomationService.toggleStatus(id, newStatus === "active" ? "ACTIVE" : "PAUSED");
      } else if (auto && isDmAuto(auto)) {
        await dmAutomationService.toggleStatus(id, newStatus === "active" ? "ACTIVE" : "PAUSED");
      } else {
        if (currentStatus === "active") {
          await automationService.pauseCommentToDm(id);
        } else {
          await automationService.resumeCommentToDm(id);
        }
      }
      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
      );
      showToast(`Automation ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const auto = automations.find((a) => a.id === id);
    try {
      if (auto && isPostReelAuto(auto)) {
        await postReelDmService.delete(id);
      } else if (auto && isStoryReplyAuto(auto)) {
        await storyReplyDmAutomationService.delete(id);
      } else if (auto && isDmAuto(auto)) {
        await dmAutomationService.delete(id);
      } else {
        await automationService.deleteCommentToDm(id);
      }
      setAutomations((prev) => prev.filter((a) => a.id !== id));
      showToast("Automation deleted", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete automation", "error");
    }
  };

  const handleDuplicate = async (auto: any) => {
    if (isPostReelAuto(auto)) {
      try {
        const res = await postReelDmService.clone(auto.id);
        if (res.success && res.data) {
          showToast("Post/Reel DM automation cloned as draft!", "success");
          fetchAllAutomations();
          return;
        }
      } catch (err: any) {
        console.error("Clone post/reel dm error:", err);
      }
    } else if (isStoryReplyAuto(auto)) {
      try {
        const res = await storyReplyDmAutomationService.clone(auto.id);
        if (res.success && res.data) {
          showToast("Story Reply automation cloned as draft!", "success");
          fetchAllAutomations();
          return;
        }
      } catch (err: any) {
        console.error("Clone story reply dm error:", err);
      }
    } else if (isDmAuto(auto)) {
      try {
        const res = await dmAutomationService.clone(auto.id);
        if (res.success && res.data) {
          showToast("DM automation cloned as draft!", "success");
          fetchAllAutomations();
          return;
        }
      } catch (err: any) {
        console.error("Clone dm error:", err);
      }
    }

    // Fallback duplicate
    const copy: Automation = {
      ...auto,
      id: `auto_${Date.now()}`,
      name: `${auto.name} (Copy)`,
      status: "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersGained: 0,
      runs: 0,
      buttonClicks: 0,
      dmsSent: 0,
      commentsSent: 0,
      stats: {
        runs: 0,
        followersGained: 0,
        buttonClicks: 0,
        triggered: 0,
        sent: 0,
        commentsSent: 0,
        failed: 0,
      },
    };
    setAutomations((prev) => [...prev, copy]);
    showToast("Automation duplicated", "success");
  };

  const handleEdit = (auto: any) => {
    if (isPostReelAuto(auto)) {
      setEditingPostReelAuto(auto.raw || auto);
      setShowPostReelWizard(true);
    } else if (isStoryReplyAuto(auto)) {
      setEditingStoryReplyAuto(auto.raw || auto);
      setShowStoryReplyWizard(true);
    } else if (isDmAuto(auto)) {
      setEditingDmAuto(auto.raw || auto);
      setShowDmWizard(true);
    } else {
      setEditingCommentAuto(auto);
      setShowCommentWizard(true);
    }
  };

  const handleSelectCreateType = (type: string) => {
    if (type === "POST_REEL_DM") {
      setEditingPostReelAuto(null);
      setShowPostReelWizard(true);
    } else if (type === "STORY_REPLY_DM") {
      setEditingStoryReplyAuto(null);
      setShowStoryReplyWizard(true);
    } else if (type === "COMMENT_TO_DM") {
      setEditingCommentAuto(null);
      setShowCommentWizard(true);
    } else {
      setEditingDmAuto(null);
      setShowDmWizard(true);
    }
  };

  const handleSaveCommentSuccess = (savedAuto: Automation, isEdit: boolean) => {
    if (isEdit) {
      setAutomations((prev) =>
        prev.map((a) => (a.id === savedAuto.id ? savedAuto : a))
      );
    } else {
      setAutomations((prev) => [savedAuto, ...prev]);
    }
    setShowCommentWizard(false);
    setEditingCommentAuto(null);
  };

  const handleSaveDmSuccess = (savedAuto: any, isEdit: boolean) => {
    const formatted: Automation = {
      id: savedAuto.id,
      name: savedAuto.name,
      type: "keyword_dm" as const,
      status: (savedAuto.status || "active").toLowerCase() as any,
      trigger: savedAuto.keywords?.length ? savedAuto.keywords.join(", ") : "Direct Message",
      conditions: [],
      template: "",
      delay: 0,
      accountId: activeWorkspace?.instagramUserId || "ig_default",
      createdAt: savedAuto.createdAt || new Date().toISOString(),
      updatedAt: savedAuto.updatedAt || new Date().toISOString(),
      runs: savedAuto.runs ?? 0,
      buttonClicks: savedAuto.buttonClicks ?? 0,
      dmsSent: savedAuto.dmsSent ?? 0,
      commentsSent: 0,
      stats: {
        runs: savedAuto.runs ?? 0,
        followersGained: 0,
        buttonClicks: savedAuto.buttonClicks ?? 0,
        sent: savedAuto.dmsSent ?? 0,
        commentsSent: 0,
        triggered: savedAuto.runs ?? 0,
        failed: 0,
      },
      raw: savedAuto,
      isDmAutomation: true,
    };

    if (isEdit) {
      setAutomations((prev) =>
        prev.map((a) => (a.id === formatted.id ? formatted : a))
      );
    } else {
      setAutomations((prev) => [formatted, ...prev]);
    }
    setShowDmWizard(false);
    setEditingDmAuto(null);
  };

  const handleOpenTestModal = (auto: Automation) => {
    if (isPostReelAuto(auto)) {
      setTestPostReelAuto(auto);
    } else {
      setTestAutomation(auto);
    }
  };

  const handleOpenExecutionsModal = (auto: Automation) => {
    if (isPostReelAuto(auto)) {
      setExecutionsPostReelAuto(auto);
    } else {
      setExecutionsAutomation(auto);
    }
  };

  const handleOpenMetricsModal = (auto: Automation) => {
    if (isPostReelAuto(auto)) {
      setMetricsPostReelAuto(auto);
    } else {
      setMetricsAutomation(auto);
    }
  };

  return (
    <div className="space-y-6">
      <AutomationHeader
        totalCount={automations.length}
        activeCount={automations.filter((a) => a.status === "active").length}
        onCreateClick={() => setShowTypeSelector(true)}
        analytics={computedAnalytics}
      />

      <AutomationFilters
        search={search}
        onSearchChange={setSearch}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      <AutomationList
        automations={filtered}
        loading={loadingAutomations}
        onToggleStatus={handleToggle}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onTest={handleOpenTestModal}
        onViewExecutions={handleOpenExecutionsModal}
        onViewMetrics={handleOpenMetricsModal}
      />

      {/* 1. Automation Type Selector Modal */}
      <AutomationTypeDialog
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
        onSelectType={handleSelectCreateType}
      />

      {/* 2. Comment-to-DM Wizard */}
      <AutomationWizardDialog
        isOpen={showCommentWizard}
        onClose={() => {
          setShowCommentWizard(false);
          setEditingCommentAuto(null);
        }}
        editingAutomation={editingCommentAuto}
        onSaveSuccess={handleSaveCommentSuccess}
      />

      {/* 3. Direct Message (DM) Automation Wizard */}
      <DmAutomationWizardDialog
        isOpen={showDmWizard}
        onClose={() => {
          setShowDmWizard(false);
          setEditingDmAuto(null);
        }}
        editingAutomation={editingDmAuto}
        onSaveSuccess={handleSaveDmSuccess}
      />

      {/* 4. Post/Reel DM Wizard Dialog */}
      <PostReelDmWizardDialog
        isOpen={showPostReelWizard}
        onClose={() => {
          setShowPostReelWizard(false);
          setEditingPostReelAuto(null);
        }}
        initialData={editingPostReelAuto}
        onSuccess={fetchAllAutomations}
      />

      {/* 5. Comment/DM Test Simulator Dialog */}
      <DmTestSimulatorDialog
        isOpen={!!testAutomation}
        onClose={() => setTestAutomation(null)}
        automationId={testAutomation?.id || null}
        automationName={testAutomation?.name}
      />

      {/* 6. Comment/DM Execution Logs Dialog */}
      <DmExecutionsDialog
        isOpen={!!executionsAutomation}
        onClose={() => setExecutionsAutomation(null)}
        automationId={executionsAutomation?.id || null}
        automationName={executionsAutomation?.name}
      />

      {/* 7. Comment/DM Performance Metrics Dialog */}
      <DmMetricsDialog
        isOpen={!!metricsAutomation}
        onClose={() => setMetricsAutomation(null)}
        automationId={metricsAutomation?.id || null}
        automationName={metricsAutomation?.name}
      />

      {/* 8. Post/Reel DM Test Simulator Dialog */}
      <PostReelDmTestSimulatorDialog
        isOpen={!!testPostReelAuto}
        onClose={() => setTestPostReelAuto(null)}
        automationId={testPostReelAuto?.id || null}
        automationName={testPostReelAuto?.name}
      />

      {/* 9. Post/Reel DM Execution Audit Logs Dialog */}
      <PostReelDmExecutionsDialog
        isOpen={!!executionsPostReelAuto}
        onClose={() => setExecutionsPostReelAuto(null)}
        automationId={executionsPostReelAuto?.id || null}
        automationName={executionsPostReelAuto?.name}
      />

      {/* 10. Post/Reel DM Performance Metrics Dialog */}
      <PostReelDmMetricsDialog
        isOpen={!!metricsPostReelAuto}
        onClose={() => setMetricsPostReelAuto(null)}
        automationId={metricsPostReelAuto?.id || null}
        automationName={metricsPostReelAuto?.name}
      />

      {/* 11. Story Reply Wizard */}
      <StoryReplyWizardDialog
        isOpen={showStoryReplyWizard}
        onClose={() => {
          setShowStoryReplyWizard(false);
          setEditingStoryReplyAuto(null);
        }}
        editingAutomation={editingStoryReplyAuto}
        onSaveSuccess={() => {
          setShowStoryReplyWizard(false);
          fetchAllAutomations();
        }}
      />
    </div>
  );
}

