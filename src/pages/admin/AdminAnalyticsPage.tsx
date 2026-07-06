import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { MOCK_ANALYTICS } from "@/constants/mockData";
import { formatNumber } from "@/utils";
import { Users, MessageCircle, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

const tooltipStyle = {
  contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" },
  labelStyle: { color: "var(--foreground)" },
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Overall platform performance and metrics</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Messages" value={formatNumber(10420000)} change="+24.5% this month" changeType="positive" icon={<MessageCircle />} />
        <StatCard title="Active Automations" value={formatNumber(215000)} change="+12.3%" changeType="positive" icon={<Zap />} />
        <StatCard title="New Users" value={formatNumber(1240)} change="This month" changeType="positive" icon={<Users />} gradient />
        <StatCard title="Growth Rate" value="23.1%" change="Month over month" changeType="positive" icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-6">Messages Sent (Platform)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MOCK_ANALYTICS}>
              <defs>
                <linearGradient id="pMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="messagesSent" stroke="var(--chart-1)" fill="url(#pMsg)" strokeWidth={2} name="Messages" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-6">Automation Triggers</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MOCK_ANALYTICS.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="automationsTriggered" name="Triggers" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-6">Comments Replied</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MOCK_ANALYTICS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Bar dataKey="commentsReplied" name="Comments" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="messagesSent" name="Messages" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-6">Follower Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MOCK_ANALYTICS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="followersGained" name="Followers" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
