import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type React from "react";
import {
  LayoutDashboard, BarChart3, Zap, FileText, MessageCircle,
  MessageSquare, Users, CreditCard, Receipt, Settings, Bell,
  Activity, HelpCircle, Camera, ChevronsUpDown, Plus, Check, Loader2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { instagramService } from "@/services";
import { getInitials } from "@/utils";

export interface InstagramAccountStatus {
  connected: boolean;
  username: string;
  instagramUserId: string;
  workspaceId: string;
}

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
  const { user, activeWorkspace, setActiveWorkspace } = useAuth();
  const location = useLocation();

  const [workspaces, setWorkspaces] = useState<InstagramAccountStatus[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingWorkspaces(true);
        const res = await instagramService.getStatus();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setWorkspaces(res.data);

          // If no active workspace is selected, or current active workspace isn't in fetched list, set first
          const currentExists = res.data.find(
            (ws) => ws.workspaceId === activeWorkspace?.workspaceId
          );
          if (!activeWorkspace || !currentExists) {
            setActiveWorkspace({
              username: res.data[0].username,
              instagramUserId: res.data[0].instagramUserId,
              workspaceId: res.data[0].workspaceId,
              connected: res.data[0].connected,
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch instagram status for workspaces", e);
      } finally {
        setLoadingWorkspaces(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors text-left focus:outline-none">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-semibold text-sm shrink-0">
                <Camera className="size-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold truncate leading-tight">
                  {loadingWorkspaces
                    ? "Loading..."
                    : activeWorkspace?.username
                    ? `@${activeWorkspace.username}`
                    : "Select Workspace"}
                </span>
                <span className="text-[11px] text-sidebar-foreground/60 truncate font-mono">
                  {activeWorkspace?.workspaceId ?? "No workspace"}
                </span>
              </div>
              {loadingWorkspaces ? (
                <Loader2 className="size-4 animate-spin text-sidebar-foreground/50 shrink-0 group-data-[collapsible=icon]:hidden" />
              ) : (
                <ChevronsUpDown className="size-4 text-sidebar-foreground/50 shrink-0 group-data-[collapsible=icon]:hidden" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60" side="bottom" sideOffset={6}>
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Connected Instagram Accounts
            </DropdownMenuLabel>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.workspaceId}
                onClick={() =>
                  setActiveWorkspace({
                    username: ws.username,
                    instagramUserId: ws.instagramUserId,
                    workspaceId: ws.workspaceId,
                    connected: ws.connected,
                  })
                }
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex size-6 items-center justify-center rounded-md bg-pink-100 dark:bg-pink-950/50 text-pink-600 shrink-0">
                    <Camera className="size-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">@{ws.username}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {ws.workspaceId}
                    </span>
                  </div>
                </div>
                {activeWorkspace?.workspaceId === ws.workspaceId && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            {workspaces.length === 0 && !loadingWorkspaces && (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No connected Instagram accounts
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground" asChild>
              <Link to="/dashboard/instagram">
                <Plus className="size-4" />
                <span className="text-sm">Connect New Account</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
