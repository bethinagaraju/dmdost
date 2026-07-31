import { Link, useLocation } from "react-router-dom";
import type React from "react";
import {
  LayoutDashboard, BarChart3, Zap, FileText, MessageCircle,
  MessageSquare, Users, CreditCard, Receipt, Settings, Bell,
  Activity, HelpCircle, Camera,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/utils";
import { APP_NAME } from "@/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BarChart3,
  Instagram: Camera,
  Zap,
  FileText,
  MessageCircle,
  MessageSquare,
  Users,
  CreditCard,
  Receipt,
  Settings,
  Bell,
  Activity,
  HelpCircle,
};

const NAV_GROUPS = [
  {
    group: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
    ],
  },
  {
    group: "Instagram",
    items: [
      { label: "Accounts", href: "/dashboard/instagram", icon: "Instagram" },
      { label: "Automations", href: "/dashboard/automations", icon: "Zap" },
      { label: "Templates", href: "/dashboard/templates", icon: "FileText" },
      { label: "Messages", href: "/dashboard/messages", icon: "MessageCircle" },
      { label: "Comments", href: "/dashboard/comments", icon: "MessageSquare" },
      { label: "Followers", href: "/dashboard/followers", icon: "Users" },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Subscription", href: "/dashboard/subscription", icon: "CreditCard" },
      { label: "Billing", href: "/dashboard/billing", icon: "Receipt" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
      { label: "Notifications", href: "/dashboard/notifications", icon: "Bell", badge: 2 },
    ],
  },
  {
    group: "Other",
    items: [
      { label: "Activity Logs", href: "/dashboard/logs", icon: "Activity" },
      { label: "Support", href: "/dashboard/support", icon: "HelpCircle" },
    ],
  },
];

export function DashboardSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <img src="/logo.png" alt={APP_NAME} className="size-8 object-contain shrink-0" />
          <span className="font-bold text-sidebar-foreground truncate">{APP_NAME}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive =
                    item.href === "/dashboard"
                      ? location.pathname === "/dashboard"
                      : location.pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.href} className="flex items-center gap-2">
                          {Icon && <Icon className="size-4" />}
                          <span>{item.label}</span>
                          {"badge" in item && item.badge && (
                            <Badge className="ml-auto size-5 p-0 justify-center text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <Link to="/dashboard/settings" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-sidebar-accent transition-colors">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate text-sidebar-foreground">{user?.name}</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
