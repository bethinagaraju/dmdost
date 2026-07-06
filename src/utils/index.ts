export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateString);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAutomationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    keyword_dm: "Keyword DM",
    comment_reply: "Comment Reply",
    follow_check: "Follow Check",
    welcome_dm: "Welcome DM",
    story_reply: "Story Reply",
    live_reply: "Live Reply",
  };
  return labels[type] ?? type;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
    inactive: "text-muted-foreground bg-muted",
    paused: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400",
    expired: "text-destructive bg-destructive/10",
    valid: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
    revoked: "text-destructive bg-destructive/10",
    paid: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
    pending: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400",
    failed: "text-destructive bg-destructive/10",
    open: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
    in_progress: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400",
    resolved: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
    closed: "text-muted-foreground bg-muted",
    replied: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
    ignored: "text-muted-foreground bg-muted",
  };
  return colors[status] ?? "text-muted-foreground bg-muted";
}
