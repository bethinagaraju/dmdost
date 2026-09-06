import { useState } from "react";
import { Plus, X, Key, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DmTriggerType, DmMatchMode, DmFollowerCondition } from "@/types";

export interface StepDmTriggerProps {
  name: string;
  setName: (name: string) => void;
  priority: number;
  setPriority: (val: number) => void;
  triggerType: DmTriggerType;
  setTriggerType: (type: DmTriggerType) => void;
  matchMode: DmMatchMode;
  setMatchMode: (mode: DmMatchMode) => void;
  caseSensitive: boolean;
  setCaseSensitive: (val: boolean) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  followerCondition: DmFollowerCondition;
  setFollowerCondition: (cond: DmFollowerCondition) => void;
  followGateMessage: string;
  setFollowGateMessage: (msg: string) => void;
}

export function StepDmTrigger({
  name,
  setName,
  priority,
  setPriority,
  triggerType,
  setTriggerType,
  matchMode,
  setMatchMode,
  caseSensitive,
  setCaseSensitive,
  keywords,
  setKeywords,
  followerCondition,
  setFollowerCondition,
  followGateMessage,
  setFollowGateMessage,
}: StepDmTriggerProps) {
  const [keywordInput, setKeywordInput] = useState("");

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const insertVariable = (variable: string) => {
    setFollowGateMessage(followGateMessage + ` {{${variable}}}`);
  };

  return (
    <div className="space-y-6">
      {/* Name and Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-3 space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Automation Name <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g., Course Access & Pricing Inquiry"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Priority</Label>
          <Input
            type="number"
            min={1}
            max={99}
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
            className="rounded-xl h-11"
          />
        </div>
      </div>

      {/* Trigger Type Selection */}
      <div className="space-y-3 pt-2 border-t border-border/50">
        <Label className="text-sm font-semibold text-foreground">Trigger Type *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              type: "KEYWORD" as const,
              title: "Keyword Match",
              desc: "Replies when DM matches specific keywords",
              icon: Key,
            },
            {
              type: "ANY_DM" as const,
              title: "Any Direct Message",
              desc: "Triggers on all incoming direct messages",
              icon: Sparkles,
            },
            {
              type: "QUESTION" as const,
              title: "Questions & Queries",
              desc: "Triggers on inquiries and common questions",
              icon: HelpCircle,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = triggerType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setTriggerType(item.type)}
                className={cn(
                  "flex flex-col items-start p-3.5 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-xs"
                    : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "size-7 rounded-lg flex items-center justify-center shrink-0 mb-2",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="text-sm font-semibold text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keywords Section (when KEYWORD or QUESTION) */}
      {triggerType !== "ANY_DM" && (
        <div className="space-y-4 rounded-2xl border border-border bg-muted/10 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Label className="text-sm font-semibold text-foreground">Trigger Keywords *</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Match Mode:</span>
                <Select value={matchMode} onValueChange={(val: any) => setMatchMode(val)}>
                  <SelectTrigger className="w-32 h-8 text-xs rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTAINS">Contains</SelectItem>
                    <SelectItem value="EXACT">Exact Match</SelectItem>
                    <SelectItem value="STARTS_WITH">Starts With</SelectItem>
                    <SelectItem value="ENDS_WITH">Ends With</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Switch
                  id="case-sensitive"
                  checked={caseSensitive}
                  onCheckedChange={setCaseSensitive}
                />
                <Label htmlFor="case-sensitive" className="text-xs cursor-pointer">
                  Case Sensitive
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type keyword and press Enter (e.g. price, cost, buy, course)..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-xl h-10"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 shrink-0 flex items-center gap-1"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </div>

          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {keywords.map((kw, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(index)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No keywords added yet. Add at least 1 keyword to trigger this automation.
            </p>
          )}
        </div>
      )}

      {/* Follower Gate Settings */}
      <div className="space-y-4 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" /> Follower Requirement & Gate
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Require users to follow your Instagram account before receiving full automation steps
            </p>
          </div>
          <Select
            value={followerCondition}
            onValueChange={(val: any) => setFollowerCondition(val)}
          >
            <SelectTrigger className="w-44 h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">No Requirement</SelectItem>
              <SelectItem value="FOLLOW_REQUIRED">Require Follow</SelectItem>
              <SelectItem value="FOLLOW_GATE">Follow Gate (Prompt)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {followerCondition !== "NONE" && (
          <div className="space-y-2 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Follow Gate Message
              </Label>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>Insert:</span>
                <button
                  type="button"
                  onClick={() => insertVariable("username")}
                  className="px-1.5 py-0.5 bg-background rounded border text-[10px] hover:bg-muted font-mono"
                >
                  {`{{username}}`}
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable("first_name")}
                  className="px-1.5 py-0.5 bg-background rounded border text-[10px] hover:bg-muted font-mono"
                >
                  {`{{first_name}}`}
                </button>
              </div>
            </div>
            <Textarea
              rows={3}
              placeholder="Hey {{username}}! 👋 Please follow our account first so we can send you the link."
              value={followGateMessage}
              onChange={(e) => setFollowGateMessage(e.target.value)}
              className="rounded-xl resize-none text-sm bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Sent automatically with an "I'm following" verification button when a non-follower messages you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
