import { Link } from "react-router-dom";
import { Users, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MOCK_ANALYTICS } from "@/constants/mockData";
import { formatNumber, getStatusColor } from "@/utils";
import { cn } from "@/lib/utils";

const ADMIN_STATS = {
  totalUsers: 12450,
  activeUsers: 8920,
  totalRevenue: 612400,
  mrr: 52150,
  churnRate: 2.4,
  newUsersThisMonth: 1240,
};

const RECENT_USERS = [
  { id: "u1", name: "Jessica Thompson", email: "jessica@stylehive.co", plan: "professional", status: "active", joinedAt: "2024-03-15", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jess" },
  { id: "u2", name: "Marcus Rivera", email: "marcus@growthlab.io", plan: "enterprise", status: "active", joinedAt: "2024-03-14", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" },
  { id: "u3", name: "Priya Sharma", email: "priya@fitwithpriya.com", plan: "starter", status: "active", joinedAt: "2024-03-14", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
  { id: "u4", name: "David Chen", email: "david@techflow.inc", plan: "professional", status: "inactive", joinedAt: "2024-03-13", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david" },
];

export default function AdminDashboardPage() {
  const tooltipStyle = {
    contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" },
    labelStyle: { color: "var(--foreground)" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={formatNumber(ADMIN_STATS.totalUsers)} change={`+${ADMIN_STATS.newUsersThisMonth} this month`} changeType="positive" icon={<Users />} />
        <StatCard title="Active Users" value={formatNumber(ADMIN_STATS.activeUsers)} change={`${Math.round((ADMIN_STATS.activeUsers / ADMIN_STATS.totalUsers) * 100)}% of total`} changeType="positive" icon={<CheckCircle />} />
        <StatCard title="MRR" value={`$${formatNumber(ADMIN_STATS.mrr)}`} change="+8.3% vs last month" changeType="positive" icon={<TrendingUp />} gradient />
        <StatCard title="Churn Rate" value={`${ADMIN_STATS.churnRate}%`} change="Below industry avg" changeType="positive" icon={<AlertCircle />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Platform Activity</h3>
            <Badge variant="outline" className="text-primary border-primary/30">Last 15 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_ANALYTICS}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="messagesSent" stroke="var(--chart-1)" fill="url(#adminGrad)" strokeWidth={2} name="Messages" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {[
              { plan: "Free", count: 6200, pct: 50, color: "bg-muted-foreground" },
              { plan: "Starter", count: 3100, pct: 25, color: "bg-chart-2" },
              { plan: "Professional", count: 2480, pct: 20, color: "bg-chart-1" },
              { plan: "Enterprise", count: 670, pct: 5, color: "bg-chart-3" },
            ].map((item) => (
              <div key={item.plan}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{item.plan}</span>
                  <span className="text-muted-foreground">{formatNumber(item.count)} ({item.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Users</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/users">View All <ArrowRight className="ml-1 size-3" /></Link>
          </Button>
        </div>
        <div className="divide-y">
          {RECENT_USERS.map((user) => (
            <div key={user.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <Avatar className="size-9">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <Badge variant="outline" className="capitalize text-xs shrink-0">{user.plan}</Badge>
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", getStatusColor(user.status))}>
                {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
