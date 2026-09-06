import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface StepPostsScopeProps {
  autoName: string;
  setAutoName: (name: string) => void;
  postScope: "SELECTED_POSTS" | "ANY_POST" | "NEXT_POST";
  setPostScope: (scope: "SELECTED_POSTS" | "ANY_POST" | "NEXT_POST") => void;
  selectedPostIds: string[];
  setSelectedPostIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeWorkspace: any;
  posts: any[];
  loadingPosts: boolean;
}

export function StepPostsScope({
  autoName,
  setAutoName,
  postScope,
  setPostScope,
  selectedPostIds,
  setSelectedPostIds,
  activeWorkspace,
  posts,
  loadingPosts,
}: StepPostsScopeProps) {
  const handlePostClick = (postId: string) => {
    if (selectedPostIds.includes(postId)) {
      setSelectedPostIds((prev) => prev.filter((id) => id !== postId));
    } else {
      setSelectedPostIds((prev) => [...prev, postId]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Automation Name */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Automation Name</Label>
        <Input
          placeholder="e.g., Cloud Tech Post Automation"
          value={autoName}
          onChange={(e) => setAutoName(e.target.value)}
          className="rounded-xl h-11"
        />
      </div>

      {/* Active Profile */}
      <div className="flex flex-col items-center justify-center py-4 border border-dashed rounded-2xl bg-muted/5">
        <div className="relative size-16 bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4] p-[2.5px] rounded-full shadow-md">
          <div className="size-full rounded-full bg-background p-0.5">
            {activeWorkspace?.profilePictureUrl ? (
              <img
                src={activeWorkspace.profilePictureUrl}
                alt={activeWorkspace.username}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 text-lg font-bold">
                {activeWorkspace?.username ? activeWorkspace.username[0].toUpperCase() : "U"}
              </div>
            )}
          </div>
        </div>
        <span className="font-semibold mt-2.5 text-sm text-foreground">
          {activeWorkspace?.username ? `@${activeWorkspace.username}` : "heyakhil29"}
        </span>
        <Link to="/dashboard/instagram" className="text-xs text-primary hover:underline mt-1">
          Switch account
        </Link>
      </div>

      {/* Selection Scope */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">The Comment is on...</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "SELECTED_POSTS", label: "Specific Post/Reel" },
            { id: "ANY_POST", label: "Any Post/Reel" },
            { id: "NEXT_POST", label: "Next Post/Reel" }
          ].map((scope) => (
            <button
              key={scope.id}
              type="button"
              onClick={() => setPostScope(scope.id as any)}
              className={cn(
                "py-3 px-2 text-center rounded-xl border text-xs font-semibold transition-all focus:outline-none",
                postScope === scope.id
                  ? "bg-primary/5 border-primary text-primary"
                  : "border-border bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specific Posts Grid */}
      {postScope === "SELECTED_POSTS" && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Select one or more Posts/Reels</Label>
          {loadingPosts ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-xl bg-muted/5">
              No posts found. Make sure your Instagram account is connected and has published posts.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-1">
              {posts.map((post) => {
                const isSelected = selectedPostIds.includes(post.id);
                const mediaSrc = post.mediaType === "VIDEO" ? post.thumbnailUrl : post.mediaUrl;
                return (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group",
                      isSelected ? "border-primary ring-2 ring-primary/20 scale-[0.98]" : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    {/* Fallback Background with Caption */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 flex items-center justify-center p-3 text-center -z-10">
                      <span className="text-[10px] text-muted-foreground line-clamp-3 font-medium">
                        {post.caption || "Instagram Post"}
                      </span>
                    </div>
                    {mediaSrc && (
                      <img
                        src={mediaSrc}
                        alt={post.caption || "Instagram Post"}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    {/* Expand overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/50 py-1 px-2.5 rounded-full">
                        Select
                      </span>
                    </div>

                    {/* Selection badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
