import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, MessageCircle, MessageSquare, Users, Activity,
  TrendingUp, ArrowRight, CheckCircle2, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/StatCard";
import { analyticsService, instagramService } from "@/services";
import { MOCK_DASHBOARD_STATS, MOCK_AUTOMATIONS, MOCK_CONVERSATIONS } from "@/constants/mockData";
import { formatNumber, getStatusColor } from "@/utils";
import type { AnalyticsData } from "@/types";
import { cn } from "@/lib/utils";
import { showToast } from "@/hooks";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function OverviewPage() {
  const [chartData, setChartData] = useState<AnalyticsData[]>([]);
  const [instagramStatus, setInstagramStatus] = useState<{ connected: boolean; username: string | null } | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    analyticsService.get("weekly").then((r) => setChartData(r.data.slice(-7)));

    console.log("Fetching Instagram status...");
    instagramService.getStatus()
      .then((res) => {
        console.log("Instagram status fetch success:", res);
        if (res.success && Array.isArray(res.data)) {
          let activeWsId: string | null = null;
          try {
            const stored = localStorage.getItem("dmdost_active_workspace");
            if (stored) {
              activeWsId = JSON.parse(stored).workspaceId;
            }
          } catch {
            // ignore JSON error
          }
          const currentWs = res.data.find((ws) => ws.workspaceId === activeWsId) || res.data[0];

          if (currentWs) {
            setInstagramStatus({
              connected: currentWs.connected,
              username: currentWs.username,
            });
            if (!currentWs.connected) {
              console.log("Not connected! Setting isModalOpen to true");
              setIsModalOpen(true);
            } else {
              console.log("Connected! Setting isModalOpen to false");
              setIsModalOpen(false);
            }
          } else {
            setInstagramStatus({ connected: false, username: null });
            setIsModalOpen(true);
          }
        } else {
          console.log("Invalid status response structure:", res);
          setIsModalOpen(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch Instagram status (catch):", err);
        // Fallback: assume not connected so user can see/try the connect modal
        setInstagramStatus({ connected: false, username: null });
        setIsModalOpen(true);
      })
      .finally(() => {
        setIsStatusLoading(false);
      });
  }, []);

  const stats = MOCK_DASHBOARD_STATS;

  const handleConnectInstagram = async () => {
    setIsActionLoading(true);
    try {
      const response = await instagramService.connectAccount();
      if (response.success && response.data?.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else {
        showToast(response.message || "Failed to generate authorization URL", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Something went wrong", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDisconnectInstagram = async () => {
    setIsActionLoading(true);
    try {
      const response = await instagramService.disconnectAccount();
      if (response.success) {
        showToast("Instagram disconnected successfully", "success");
        setInstagramStatus({ connected: false, username: null });
      } else {
        showToast(response.message || "Failed to disconnect", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Something went wrong", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dialog for Not Connected State */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md border-0 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden p-8 rounded-3xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" />

          {/* Decorative background blur */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-[#E1306C]/10 blur-[80px] pointer-events-none -z-10" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-[#FCAF45]/10 blur-[80px] pointer-events-none -z-10" />

          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 text-white"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-center">Instagram Connection</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm text-center">
              Connect your Instagram professional account to begin automating DMs and comments.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={handleConnectInstagram}
              disabled={isActionLoading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-opacity border-0 text-white shadow-md hover:shadow-lg rounded-xl"
            >
              {isActionLoading ? "Connecting..." : "Connect Instagram"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="w-full h-12 text-sm text-muted-foreground hover:text-foreground"
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button asChild className="gradient-brand text-white border-0 hover:opacity-90">
          <Link to="/dashboard/automations">
            <Zap className="size-4 mr-2" />New Automation
          </Link>
        </Button>
      </div>

      {/* Instagram Integration Card */}
      {!isStatusLoading && instagramStatus && (
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-md transition-all duration-300 hover:shadow-lg">
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 w-[20%] h-full bg-gradient-to-l from-[#E1306C]/10 to-transparent -z-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "size-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md",
                instagramStatus.connected
                  ? "bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
                  : "bg-muted text-muted-foreground"
              )}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Instagram Connection</h3>
                  {instagramStatus.connected ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-0 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-muted-foreground" />
                      Not Connected
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {instagramStatus.connected
                    ? `Currently active integration with @${instagramStatus.username}`
                    : "Connect your Instagram professional account to begin automating DMs and comments."}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {instagramStatus.connected ? (
                <Button
                  variant="outline"
                  onClick={handleDisconnectInstagram}
                  disabled={isActionLoading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={handleConnectInstagram}
                  disabled={isActionLoading}
                  className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-opacity border-0 text-white font-medium px-6"
                >
                  Connect Instagram
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Automations"
          value={stats.totalAutomations}
          change={`${stats.activeAutomations} active`}
          changeType="positive"
          icon={<Zap />}
        />
        <StatCard
          title="Messages Sent"
          value={formatNumber(stats.messagesSent)}
          change="+12.5%"
          changeType="positive"
          icon={<MessageCircle />}
        />
        <StatCard
          title="Comments Replied"
          value={formatNumber(stats.commentsReplied)}
          change="+8.3%"
          changeType="positive"
          icon={<MessageSquare />}
        />
        <StatCard
          title="Followers Gained"
          value={formatNumber(stats.followersGained)}
          change="+23.1%"
          changeType="positive"
          icon={<Users />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Connected Accounts"
          value={stats.connectedAccounts}
          icon={<Activity />}
          gradient
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          change="Excellent"
          changeType="positive"
          icon={<CheckCircle2 />}
        />
        <StatCard
          title="Monthly Usage"
          value={`${stats.monthlyUsage}%`}
          change="4,235 / 10,000 msgs"
          changeType="neutral"
          icon={<TrendingUp />}
        />
        <StatCard
          title="Failure Rate"
          value="3.2%"
          change="Low"
          changeType="positive"
          icon={<AlertCircle />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Messages Sent</h3>
              <p className="text-muted-foreground text-sm">Last 7 days performance</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              +12.5% vs last week
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Area type="monotone" dataKey="messagesSent" stroke="var(--chart-1)" fill="url(#colorMessages)" strokeWidth={2} name="Messages" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Monthly Usage</h3>
            <Link to="/dashboard/subscription" className="text-xs text-primary hover:underline">Upgrade</Link>
          </div>
          {[
            { label: "Messages", used: 4235, limit: 10000, color: "bg-chart-1" },
            { label: "Automations", used: 5, limit: 20, color: "bg-chart-2" },
            { label: "Accounts", used: 2, limit: 5, color: "bg-chart-3" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
              </div>
              <Progress value={(item.used / item.limit) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Automations</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/automations">View All <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {MOCK_AUTOMATIONS.slice(0, 4).map((auto) => (
              <div key={auto.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{auto.name}</div>
                  <div className="text-xs text-muted-foreground">{auto.stats.sent.toLocaleString()} sent</div>
                </div>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getStatusColor(auto.status))}>
                  {auto.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Messages</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/messages">View All <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {MOCK_CONVERSATIONS.slice(0, 4).map((conv) => (
              <div key={conv.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={conv.participant.avatar} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">{conv.participant.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{conv.participant.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="size-5 p-0 justify-center text-xs">{conv.unreadCount}</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
