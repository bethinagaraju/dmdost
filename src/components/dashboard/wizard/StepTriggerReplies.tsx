import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface StepTriggerRepliesProps {
  triggerType: "COMMENT_KEYWORD" | "ANY_COMMENT";
  setTriggerType: (type: "COMMENT_KEYWORD" | "ANY_COMMENT") => void;
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  keywordInput: string;
  setKeywordInput: (input: string) => void;
  replyToComment: boolean;
  setReplyToComment: (reply: boolean) => void;
  commentReply1: string;
  setCommentReply1: (reply: string) => void;
  commentReply2: string;
  setCommentReply2: (reply: string) => void;
  commentReply3: string;
  setCommentReply3: (reply: string) => void;
}

export function StepTriggerReplies({
  triggerType,
  setTriggerType,
  keywords,
  setKeywords,
  keywordInput,
  setKeywordInput,
  replyToComment,
  setReplyToComment,
  commentReply1,
  setCommentReply1,
  commentReply2,
  setCommentReply2,
  commentReply3,
  setCommentReply3,
}: StepTriggerRepliesProps) {
  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const kw = keywordInput.trim().toLowerCase();
      if (!keywords.includes(kw)) {
        setKeywords((prev) => [...prev, kw]);
      }
      setKeywordInput("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Trigger Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">
          What kind of comment should trigger this automation?
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "COMMENT_KEYWORD", label: "Specific keyword" },
            { id: "ANY_COMMENT", label: "Any comment" }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setTriggerType(type.id as any)}
              className={cn(
                "py-3 px-2 text-center rounded-xl border text-xs font-semibold transition-all focus:outline-none",
                triggerType === type.id
                  ? "bg-primary/5 border-primary text-primary"
                  : "border-border bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyword tags manager */}
      {triggerType === "COMMENT_KEYWORD" && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Should include any of these:</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a keyword (min. 1 characters)"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              className="rounded-xl h-11"
            />
            <Button
              type="button"
              onClick={handleAddKeyword}
              className="h-11 px-4 border border-border bg-background hover:bg-muted text-foreground"
            >
              + Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Keywords are not case-sensitive (e.g., "Hello" and "hello" are treated the same). Automations trigger only on exact keyword matches — for example, the keyword "ai" will match "ai" but not "pain."
          </p>

          {/* Badges container */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {keywords.map((kw) => (
                <Badge
                  key={kw}
                  variant="secondary"
                  className="py-1 px-3 text-xs bg-primary/5 text-primary border border-primary/20 rounded-full flex items-center gap-1.5 font-medium"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => setKeywords(prev => prev.filter(k => k !== kw))}
                    className="hover:text-destructive text-primary/60 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto reply switch */}
      <div className="p-4 rounded-2xl border border-border bg-muted/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <Label className="text-sm font-semibold text-foreground">
              Auto-Reply to comments on the post
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically reply to the user's public comment on the post itself.
            </p>
          </div>
          <Switch
            checked={replyToComment}
            onCheckedChange={setReplyToComment}
          />
        </div>

        {replyToComment && (
          <div className="space-y-3 pt-3 border-t border-border/50">
            <Label className="text-xs font-semibold text-muted-foreground block">
              Public Reply Comments (Randomized Options)
            </Label>
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-medium text-muted-foreground select-none">Option 1</span>
                <Textarea
                  placeholder="e.g., Thanks for your interest! Check your DMs."
                  value={commentReply1}
                  onChange={(e) => setCommentReply1(e.target.value)}
                  rows={2}
                  className="rounded-xl resize-none text-sm pl-16 pt-2.5"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-medium text-muted-foreground select-none">Option 2</span>
                <Textarea
                  placeholder="e.g., I've sent you a DM with the link! (Optional)"
                  value={commentReply2}
                  onChange={(e) => setCommentReply2(e.target.value)}
                  rows={2}
                  className="rounded-xl resize-none text-sm pl-16 pt-2.5"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-medium text-muted-foreground select-none">Option 3</span>
                <Textarea
                  placeholder="e.g., Check your inbox! Details sent. (Optional)"
                  value={commentReply3}
                  onChange={(e) => setCommentReply3(e.target.value)}
                  rows={2}
                  className="rounded-xl resize-none text-sm pl-16 pt-2.5"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal mt-1">
              Add up to 3 variations. A random option will be chosen for each reply to keep comments natural and avoid spam detection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
