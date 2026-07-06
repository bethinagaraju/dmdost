import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, UserCheck, UserMinus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatNumber } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";

interface Follower {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isFollowingBack: boolean;
  followers: number;
  followedAt: string;
  isVerified: boolean;
}

const MOCK_FOLLOWERS: Follower[] = [
  { id: "f1", username: "sarah_w", displayName: "Sarah Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=s1", isFollowingBack: true, followers: 4200, followedAt: "2024-03-15T10:00:00Z", isVerified: false },
  { id: "f2", username: "marcuschen", displayName: "Marcus Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=m2", isFollowingBack: false, followers: 12800, followedAt: "2024-03-14T15:30:00Z", isVerified: true },
  { id: "f3", username: "emilyr", displayName: "Emily Rodriguez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=e3", isFollowingBack: true, followers: 892, followedAt: "2024-03-14T09:00:00Z", isVerified: false },
  { id: "f4", username: "jameswilson", displayName: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=j4", isFollowingBack: false, followers: 3400, followedAt: "2024-03-13T20:00:00Z", isVerified: false },
  { id: "f5", username: "aishap", displayName: "Aisha Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=a5", isFollowingBack: true, followers: 28900, followedAt: "2024-03-13T14:00:00Z", isVerified: true },
  { id: "f6", username: "techguru_99", displayName: "Tech Guru", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tg", isFollowingBack: false, followers: 67000, followedAt: "2024-03-12T11:00:00Z", isVerified: true },
  { id: "f7", username: "shopaholic_life", displayName: "Shop Life", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sh", isFollowingBack: true, followers: 1100, followedAt: "2024-03-11T08:00:00Z", isVerified: false },
  { id: "f8", username: "real_photography", displayName: "Real Photography", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rp", isFollowingBack: true, followers: 9800, followedAt: "2024-03-10T16:00:00Z", isVerified: false },
];

export default function FollowersPage() {
  const [followers, setFollowers] = useState<Follower[]>(MOCK_FOLLOWERS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filtered = followers
    .filter((f) => {
      const matchSearch = f.username.toLowerCase().includes(search.toLowerCase()) || f.displayName.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || (filterType === "mutual" && f.isFollowingBack) || (filterType === "non_mutual" && !f.isFollowingBack);
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === "followers") return b.followers - a.followers;
      if (sortBy === "name") return a.displayName.localeCompare(b.displayName);
      return new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime();
    });

  const mutualCount = followers.filter((f) => f.isFollowingBack).length;
  const nonMutualCount = followers.filter((f) => !f.isFollowingBack).length;

  const handleFollowBack = (id: string, isFollowing: boolean) => {
    setFollowers((prev) => prev.map((f) => f.id === id ? { ...f, isFollowingBack: !isFollowing } : f));
    showToast(isFollowing ? "Unfollowed" : "Following back!", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Followers</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your Instagram followers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Followers" value={formatNumber(followers.length)} icon={<Users />} changeType="positive" change="+118 this month" />
        <StatCard title="Mutual Follows" value={mutualCount} icon={<UserCheck />} changeType="positive" change={`${Math.round((mutualCount / followers.length) * 100)}% of followers`} />
        <StatCard title="Not Following Back" value={nonMutualCount} icon={<UserMinus />} changeType="neutral" change="Consider engaging" />
        <StatCard title="Growth Rate" value="+23.1%" icon={<TrendingUp />} changeType="positive" change="vs last month" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search followers..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Followers</SelectItem>
            <SelectItem value="mutual">Mutual Follows</SelectItem>
            <SelectItem value="non_mutual">Not Following Back</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="followers">Most Followers</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <span className="text-sm text-muted-foreground font-medium">{filtered.length} followers shown</span>
        </div>
        <div className="divide-y">
          {filtered.map((follower, i) => (
            <motion.div
              key={follower.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <Avatar className="size-10 shrink-0">
                <AvatarImage src={follower.avatar} />
                <AvatarFallback className="text-sm bg-primary text-primary-foreground">{follower.displayName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{follower.displayName}</span>
                  {follower.isVerified && (
                    <span className="size-4 rounded-full gradient-brand flex items-center justify-center">
                      <svg className="size-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">@{follower.username} &bull; {formatNumber(follower.followers)} followers</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={follower.isFollowingBack ? "default" : "outline"}
                  className={cn(
                    "text-xs",
                    follower.isFollowingBack ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : ""
                  )}
                >
                  {follower.isFollowingBack ? <><UserCheck className="size-3 mr-1" />Mutual</> : <><TrendingDown className="size-3 mr-1" />Not following back</>}
                </Badge>
                <Button
                  size="sm"
                  variant={follower.isFollowingBack ? "outline" : "default"}
                  onClick={() => handleFollowBack(follower.id, follower.isFollowingBack)}
                  className={cn("h-7 text-xs", !follower.isFollowingBack && "gradient-brand text-white border-0 hover:opacity-90")}
                >
                  {follower.isFollowingBack ? "Unfollow" : "Follow Back"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No followers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
