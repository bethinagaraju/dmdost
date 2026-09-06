import { Zap } from "lucide-react";
import { AutomationCard } from "./AutomationCard";
import type { Automation } from "@/types";

export interface AutomationListProps {
  automations: Automation[];
  loading?: boolean;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onEdit: (automation: Automation) => void;
  onDuplicate: (automation: Automation) => void;
  onDelete: (id: string) => void;
  onTest?: (automation: Automation) => void;
  onViewExecutions?: (automation: Automation) => void;
  onViewMetrics?: (automation: Automation) => void;
}

export function AutomationList({
  automations,
  loading = false,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
  onTest,
  onViewExecutions,
  onViewMetrics,
}: AutomationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-2xl border bg-card/60 p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/6" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="h-12 bg-muted/60 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {automations.map((auto, i) => (
        <AutomationCard
          key={auto.id}
          automation={auto}
          index={i}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onTest={onTest}
          onViewExecutions={onViewExecutions}
          onViewMetrics={onViewMetrics}
        />
      ))}

      {automations.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Zap className="size-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No automations found</p>
          <p className="text-sm">Try adjusting your filters or create a new automation</p>
        </div>
      )}
    </div>
  );
}
