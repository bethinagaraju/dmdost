import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@/services";
import { MOCK_NOTIFICATIONS } from "@/constants/mockData";
import { timeAgo } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const TYPE_CONFIG = {
  success: { icon: CheckCircle, className: "text-green-600 bg-green-50 dark:bg-green-950" },
  info: { icon: Info, className: "text-blue-600 bg-blue-50 dark:bg-blue-950" },
  warning: { icon: AlertTriangle, className: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950" },
  error: { icon: XCircle, className: "text-destructive bg-destructive/10" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = notifications.filter((n) => filter === "all" || !n.isRead);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast("All notifications marked as read", "success");
  };

  const handleDelete = async (id: string) => {
    await notificationService.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="size-4 mr-2" />Mark All Read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? "gradient-brand text-white border-0 hover:opacity-90" : ""}
          >
            {f === "all" ? "All" : "Unread"}
            {f === "unread" && unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 size-5 p-0 justify-center text-[10px]">{unreadCount}</Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((notif, i) => {
          const cfg = TYPE_CONFIG[notif.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border transition-colors",
                !notif.isRead ? "bg-primary/5 border-primary/20" : "bg-card"
              )}
            >
              <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0", cfg.className)}>
                <Icon className="size-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("font-semibold text-sm", !notif.isRead && "text-foreground")}>{notif.title}</span>
                  {!notif.isRead && <span className="size-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                <div className="text-xs text-muted-foreground mt-1">{timeAgo(notif.timestamp)}</div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!notif.isRead && (
                  <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground" onClick={() => handleMarkRead(notif.id)}>
                    <CheckCheck className="size-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(notif.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{filter === "unread" ? "No unread notifications" : "No notifications yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
