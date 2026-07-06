import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Wifi, WifiOff, Users, Image, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { instagramService } from "@/services";
import { MOCK_INSTAGRAM_ACCOUNTS } from "@/constants/mockData";
import { formatNumber, getStatusColor, formatDate } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { InstagramAccount } from "@/types";

export default function InstagramPage() {
  const [accounts, setAccounts] = useState<InstagramAccount[]>(MOCK_INSTAGRAM_ACCOUNTS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConnect = async () => {
    const r = await instagramService.connectAccount();
    showToast(r.message, "info");
    const newAccount: InstagramAccount = {
      id: `ig_${Date.now()}`,
      username: "new_connected_account",
      displayName: "New Account",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=new${Date.now()}`,
      followers: 1500,
      following: 400,
      posts: 55,
      isConnected: true,
      tokenStatus: "valid",
      connectedAt: new Date().toISOString(),
      permissions: ["instagram_basic"],
    };
    setAccounts((prev) => [...prev, newAccount]);
    showToast("Instagram account connected!", "success");
  };

  const handleDisconnect = async (id: string) => {
    setLoadingId(id);
    await instagramService.disconnectAccount(id);
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, isConnected: false, tokenStatus: "revoked" as const } : a));
    showToast("Account disconnected", "success");
    setLoadingId(null);
  };

  const handleRefreshToken = async (id: string) => {
    setLoadingId(id);
    await instagramService.refreshToken(id);
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, tokenStatus: "valid" as const } : a));
    showToast("Token refreshed successfully!", "success");
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Instagram Accounts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your connected Instagram accounts</p>
        </div>
        <Button onClick={handleConnect} className="gradient-brand text-white border-0 hover:opacity-90">
          <Plus className="size-4 mr-2" />Connect Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account, i) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border bg-card p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{account.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{account.displayName}</div>
                  <div className="text-sm text-muted-foreground">@{account.username}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", getStatusColor(account.tokenStatus))}>
                  {account.tokenStatus}
                </Badge>
                {account.isConnected ? (
                  <Wifi className="size-4 text-green-500" />
                ) : (
                  <WifiOff className="size-4 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="size-3 text-muted-foreground" />
                </div>
                <div className="font-bold">{formatNumber(account.followers)}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="size-3 text-muted-foreground" />
                </div>
                <div className="font-bold">{formatNumber(account.following)}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Image className="size-3 text-muted-foreground" />
                </div>
                <div className="font-bold">{account.posts}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
            </div>

            {account.permissions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {account.permissions.map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">
                    {perm.replace("instagram_", "")}
                  </Badge>
                ))}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Connected: {formatDate(account.connectedAt)}
            </div>

            <div className="flex gap-2">
              {account.tokenStatus === "expired" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRefreshToken(account.id)}
                  disabled={loadingId === account.id}
                  className="flex-1"
                >
                  <RefreshCw className={cn("size-3 mr-1", loadingId === account.id && "animate-spin")} />
                  Refresh Token
                </Button>
              )}
              <Button size="sm" variant="outline" className="flex-1">
                <ExternalLink className="size-3 mr-1" />View Profile
              </Button>
              {account.isConnected && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5">
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect @{account.username} and pause all automations linked to it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDisconnect(account.id)} className="bg-destructive text-white hover:bg-destructive/90">
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
