import { useNavigate, useLocation, Link } from "react-router-dom";
import { Bell, Search, LogOut, User, Settings, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/utils";
import { showToast } from "@/hooks";

function getBreadcrumb(pathname: string): string[] {
  const segments = pathname.replace("/dashboard", "").split("/").filter(Boolean);
  if (segments.length === 0) return ["Dashboard"];
  return ["Dashboard", ...segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "))];
}

export function DashboardTopbar() {
  const { user, logout, activeWorkspace } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumbs = getBreadcrumb(location.pathname);

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3" />}
            <span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>{crumb}</span>
          </span>
        ))}
      </nav>

      {activeWorkspace?.username && (
        <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border-pink-500/30 text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-950/20">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          @{activeWorkspace.username}
        </Badge>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="w-48 pl-8 h-8 text-sm" />
        </div>

        <ModeToggle />

        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/dashboard/notifications">
            <Bell className="size-4" />
            <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 justify-center text-[10px]">2</Badge>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 pl-2 pr-3">
              <Avatar className="size-6">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-24 truncate">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings"><User className="size-4 mr-2" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings"><Settings className="size-4 mr-2" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="size-4 mr-2" />Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
