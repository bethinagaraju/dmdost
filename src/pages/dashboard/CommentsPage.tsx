import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, CheckCircle, Clock, X, Zap, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { commentService } from "@/services";
import { MOCK_COMMENTS } from "@/constants/mockData";
import { timeAgo } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types";

const STATUS_CONFIG = {
  replied: { label: "Replied", icon: CheckCircle, className: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" },
  pending: { label: "Pending", icon: Clock, className: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" },
  ignored: { label: "Ignored", icon: X, className: "text-muted-foreground bg-muted border-border" },
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = comments.filter((c) => {
    const matchSearch = c.author.toLowerCase().includes(search.toLowerCase()) || c.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.replyStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: comments.length,
    replied: comments.filter((c) => c.replyStatus === "replied").length,
    pending: comments.filter((c) => c.replyStatus === "pending").length,
    ignored: comments.filter((c) => c.replyStatus === "ignored").length,
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    await commentService.reply(commentId, replyText);
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, replyStatus: "replied" as const } : c));
    showToast("Reply posted!", "success");
    setReplyingTo(null);
    setReplyText("");
  };

  const handleIgnore = async (id: string) => {
    await commentService.ignore(id);
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, replyStatus: "ignored" as const } : c));
    showToast("Comment ignored", "info");
  };

  const highlightKeyword = (text: string, keyword?: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-primary/20 text-primary rounded px-0.5 font-medium">{part}</mark> : part
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comments</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor and respond to comments on your posts</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "replied", "ignored"] as const).map((s) => (
          <Button
            key={s}
            variant={filterStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(s)}
            className={filterStatus === s ? "gradient-brand text-white border-0 hover:opacity-90" : ""}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            <Badge variant="secondary" className="ml-1.5 size-5 p-0 justify-center text-[10px]">{counts[s]}</Badge>
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search comments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((comment, i) => {
          const statusCfg = STATUS_CONFIG[comment.replyStatus];
          const StatusIcon = statusCfg.icon;
          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <Avatar className="size-9 shrink-0">
                  <AvatarImage src={comment.authorAvatar} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">{comment.author[0].toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-semibold text-sm">@{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(comment.timestamp)}</span>
                    <Badge className={cn("text-xs border flex items-center gap-1", statusCfg.className)}>
                      <StatusIcon className="size-3" />
                      {statusCfg.label}
                    </Badge>
                    {comment.matchedKeyword && (
                      <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/5 flex items-center gap-1">
                        <Tag className="size-3" />
                        keyword: {comment.matchedKeyword}
                      </Badge>
                    )}
                    {comment.automationId && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Zap className="size-3" />
                        Auto-handled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {highlightKeyword(comment.content, comment.matchedKeyword)}
                  </p>

                  {replyingTo === comment.id ? (
                    <div className="mt-3 flex gap-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 h-9 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleReply(comment.id)} className="gradient-brand text-white border-0 hover:opacity-90">Reply</Button>
                      <Button size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyText(""); }}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      {comment.replyStatus !== "replied" && (
                        <Button size="sm" variant="outline" onClick={() => setReplyingTo(comment.id)} className="text-xs h-7 px-3">
                          <MessageSquare className="size-3 mr-1" />Reply
                        </Button>
                      )}
                      {comment.replyStatus === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleIgnore(comment.id)} className="text-xs h-7 px-3 text-muted-foreground">
                          <X className="size-3 mr-1" />Ignore
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="size-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No comments found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
