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
import { analyticsService } from "@/services";
import { MOCK_DASHBOARD_STATS, MOCK_AUTOMATIONS, MOCK_CONVERSATIONS } from "@/constants/mockData";
import { formatNumber, getStatusColor } from "@/utils";
import type { AnalyticsData } from "@/types";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const [chartData, setChartData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    analyticsService.get("weekly").then((r) => setChartData(r.data.slice(-7)));
  }, []);

  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="space-y-6">
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
