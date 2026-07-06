import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CreditCard, TrendingUp, DollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatNumber, formatCurrency, getStatusColor, formatDate } from "@/utils";
import { cn } from "@/lib/utils";

const SUBSCRIPTIONS = [
  { id: "sub_1", user: "Jessica Thompson", email: "jessica@stylehive.co", plan: "professional", status: "active", amount: 4900, billingCycle: "monthly", nextBilling: "2024-04-01T00:00:00Z" },
  { id: "sub_2", user: "Marcus Rivera", email: "marcus@growthlab.io", plan: "enterprise", status: "active", amount: 14900, billingCycle: "monthly", nextBilling: "2024-04-01T00:00:00Z" },
  { id: "sub_3", user: "Priya Sharma", email: "priya@fitwithpriya.com", plan: "starter", status: "active", amount: 1900, billingCycle: "monthly", nextBilling: "2024-04-01T00:00:00Z" },
  { id: "sub_4", user: "David Chen", email: "david@techflow.inc", plan: "professional", status: "canceled", amount: 4900, billingCycle: "monthly", nextBilling: "2024-04-01T00:00:00Z" },
  { id: "sub_5", user: "Alex Johnson", email: "alex@example.com", plan: "professional", status: "active", amount: 4900, billingCycle: "monthly", nextBilling: "2024-04-01T00:00:00Z" },
];

const REVENUE_DATA = [
  { month: "Oct", mrr: 42000 }, { month: "Nov", mrr: 44500 }, { month: "Dec", mrr: 46800 },
  { month: "Jan", mrr: 48200 }, { month: "Feb", mrr: 50100 }, { month: "Mar", mrr: 52150 },
];

const PLAN_DATA = [
  { month: "Jan", free: 4800, starter: 2600, professional: 1950, enterprise: 520 },
  { month: "Feb", free: 5200, starter: 2800, professional: 2100, enterprise: 580 },
  { month: "Mar", free: 6200, starter: 3100, professional: 2480, enterprise: 670 },
];

const PLAN_COLORS: Record<string, string> = {
  free: "text-muted-foreground bg-muted border-border",
  starter: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  professional: "text-primary bg-primary/10 border-primary/20",
  enterprise: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
};

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  const filtered = SUBSCRIPTIONS.filter((s) => {
    const matchSearch = s.user.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || s.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const tooltipStyle = {
    contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" },
    labelStyle: { color: "var(--foreground)" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">Revenue and subscription management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="MRR" value="$52,150" change="+8.3%" changeType="positive" icon={<DollarSign />} gradient />
        <StatCard title="ARR" value="$625,800" change="Projected" changeType="positive" icon={<TrendingUp />} />
        <StatCard title="Paid Users" value="6,250" change="+240 this month" changeType="positive" icon={<Users />} />
        <StatCard title="Churn Rate" value="2.4%" change="Below avg" changeType="positive" icon={<CreditCard />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-6">MRR Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`$${formatNumber(Number(v))}`, "MRR"]} />
              <Area type="monotone" dataKey="mrr" stroke="var(--chart-1)" fill="url(#mrrGrad)" strokeWidth={2} name="MRR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-6">Users by Plan</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PLAN_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Bar dataKey="starter" name="Starter" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="professional" name="Pro" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="enterprise" name="Enterprise" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search subscriptions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="divide-y">
          {filtered.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{sub.user}</div>
                <div className="text-xs text-muted-foreground">{sub.email}</div>
              </div>
              <Badge variant="outline" className={cn("text-xs border capitalize shrink-0", PLAN_COLORS[sub.plan] ?? "")}>{sub.plan}</Badge>
              <div className="text-sm font-semibold shrink-0">{formatCurrency(sub.amount / 100)}/mo</div>
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0 capitalize", getStatusColor(sub.status))}>{sub.status}</span>
              <div className="text-xs text-muted-foreground shrink-0 hidden md:block">Renews {formatDate(sub.nextBilling)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
