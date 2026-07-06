import { useState } from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { subscriptionService } from "@/services";
import { MOCK_SUBSCRIPTION } from "@/constants/mockData";
import { PRICING_PLANS } from "@/constants";
import { formatDate } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/types";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTION);
  const [isYearly, setIsYearly] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const currentPlan = PRICING_PLANS.find((p) => p.id === subscription.plan);
  const { usage } = subscription;

  const handleUpgrade = async (planId: string) => {
    if (planId === subscription.plan) return;
    setIsUpgrading(planId);
    await subscriptionService.upgrade(planId);
    setSubscription((prev) => ({ ...prev, plan: planId as Subscription["plan"] }));
    showToast(`Upgraded to ${planId} plan!`, "success");
    setIsUpgrading(null);
  };

  const handleCancel = async () => {
    await subscriptionService.cancel();
    setSubscription((prev) => ({ ...prev, cancelAtPeriodEnd: true }));
    showToast("Subscription will cancel at period end", "info");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your plan and usage</p>
      </div>

      {/* Current plan */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold">{currentPlan?.name ?? "Free"} Plan</h2>
              <Badge className="gradient-brand text-white border-0">Current Plan</Badge>
              {subscription.cancelAtPeriodEnd && (
                <Badge variant="outline" className="text-destructive border-destructive/30">
                  <AlertTriangle className="size-3 mr-1" />Canceling
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {subscription.status === "active" ? (
                <>Renews on <strong>{formatDate(subscription.currentPeriodEnd)}</strong></>
              ) : (
                "Subscription inactive"
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!subscription.cancelAtPeriodEnd ? (
              <Button variant="outline" onClick={handleCancel} className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5">
                Cancel Plan
              </Button>
            ) : (
              <Button onClick={() => setSubscription((p) => ({ ...p, cancelAtPeriodEnd: false }))} className="gradient-brand text-white border-0">
                Reactivate
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Messages</span>
              <span className="text-muted-foreground">{usage.messages.used.toLocaleString()} / {usage.messages.limit.toLocaleString()}</span>
            </div>
            <Progress value={(usage.messages.used / usage.messages.limit) * 100} className="h-2.5" />
            <p className="text-xs text-muted-foreground mt-1">{Math.round((usage.messages.used / usage.messages.limit) * 100)}% used</p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Automations</span>
              <span className="text-muted-foreground">{usage.automations.used} / {usage.automations.limit}</span>
            </div>
            <Progress value={(usage.automations.used / usage.automations.limit) * 100} className="h-2.5" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Instagram Accounts</span>
              <span className="text-muted-foreground">{usage.accounts.used} / {usage.accounts.limit}</span>
            </div>
            <Progress value={(usage.accounts.used / usage.accounts.limit) * 100} className="h-2.5" />
          </div>
        </div>
      </motion.div>

      {/* Plan selector */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Change Plan</h2>
          <div className="flex items-center gap-3">
            <Label className="text-sm">Monthly</Label>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <Label className="text-sm">Yearly <Badge variant="secondary" className="ml-1 text-xs text-green-600">Save 20%</Badge></Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {PRICING_PLANS.map((plan, i) => {
            const isCurrent = plan.id === subscription.plan;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "rounded-2xl border p-5 relative flex flex-col",
                  plan.popular ? "border-primary shadow-sm" : "",
                  isCurrent ? "bg-primary/5 border-primary" : "bg-card"
                )}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-brand text-white border-0 text-xs">Most Popular</Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs">Current</Badge>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-bold text-base">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${price}</span>
                    {price > 0 && <span className="text-muted-foreground text-sm">/mo</span>}
                  </div>
                </div>

                <ul className="space-y-1.5 flex-1 mb-4">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full",
                    isCurrent ? "cursor-default" : "gradient-brand text-white border-0 hover:opacity-90"
                  )}
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || isUpgrading === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrent ? "Current Plan" : isUpgrading === plan.id ? "Upgrading..." : plan.id === "free" ? "Downgrade" : "Upgrade"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
