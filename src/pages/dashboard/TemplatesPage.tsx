import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Copy, Trash2, Eye, MessageCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { templateService } from "@/services";
import { MOCK_TEMPLATES } from "@/constants/mockData";
import { formatDate } from "@/utils";
import { showToast } from "@/hooks";
import type { DmTemplate } from "@/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DmTemplate[]>(MOCK_TEMPLATES);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [preview, setPreview] = useState<DmTemplate | null>(null);
  const [form, setForm] = useState({ name: "", content: "", type: "dm" });
  const [isCreating, setIsCreating] = useState(false);

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  const dmTemplates = filtered.filter((t) => t.type === "dm");
  const commentTemplates = filtered.filter((t) => t.type === "comment");

  const handleCreate = async () => {
    if (!form.name.trim() || !form.content.trim()) { showToast("Name and content required", "error"); return; }
    setIsCreating(true);
    const vars = (form.content.match(/\{\{(\w+)\}\}/g) ?? []).map((v) => v.replace(/[{}]/g, ""));
    const r = await templateService.create({ ...form, variables: vars, type: form.type as "dm" | "comment" });
    setTemplates((prev) => [...prev, r.data]);
    setShowCreate(false);
    setForm({ name: "", content: "", type: "dm" });
    showToast("Template created!", "success");
    setIsCreating(false);
  };

  const handleDuplicate = async (tpl: DmTemplate) => {
    const r = await templateService.create({ ...tpl, name: `${tpl.name} (Copy)` });
    setTemplates((prev) => [...prev, r.data]);
    showToast("Template duplicated", "success");
  };

  const handleDelete = async (id: string) => {
    await templateService.delete(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast("Template deleted", "success");
  };

  const renderTemplateCard = (tpl: DmTemplate, i: number) => (
    <motion.div
      key={tpl.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl border bg-card p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {tpl.type === "dm" ? <MessageCircle className="size-4 text-primary" /> : <MessageSquare className="size-4 text-primary" />}
          </div>
          <div>
            <div className="font-semibold text-sm">{tpl.name}</div>
            <div className="text-xs text-muted-foreground">{formatDate(tpl.updatedAt)}</div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">{tpl.type.toUpperCase()}</Badge>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">{tpl.content}</p>
      {tpl.variables.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tpl.variables.map((v) => (
            <Badge key={v} variant="secondary" className="text-xs font-mono">{`{{${v}}}`}</Badge>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreview(tpl)}>
          <Eye className="size-3 mr-1" />Preview
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDuplicate(tpl)}>
          <Copy className="size-3" />
        </Button>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30" onClick={() => handleDelete(tpl.id)}>
          <Trash2 className="size-3" />
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage message templates</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-brand text-white border-0 hover:opacity-90">
          <Plus className="size-4 mr-2" />New Template
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search templates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="dm">
        <TabsList>
          <TabsTrigger value="dm">DM Templates ({dmTemplates.length})</TabsTrigger>
          <TabsTrigger value="comment">Comment Templates ({commentTemplates.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="dm" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {dmTemplates.map((t, i) => renderTemplateCard(t, i))}
          </div>
        </TabsContent>
        <TabsContent value="comment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {commentTemplates.map((t, i) => renderTemplateCard(t, i))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Template</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Welcome DM" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dm">DM Template</SelectItem>
                    <SelectItem value="comment">Comment Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message Content</Label>
              <Textarea
                placeholder="Hi {{name}}! Thanks for following {{account}}. Use variables like {{name}}, {{account}}, {{link}}"
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Use <code className="bg-muted px-1 rounded">{"{{variable}}"}</code> for dynamic personalization</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating} className="gradient-brand text-white border-0 hover:opacity-90">
              {isCreating ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Template Preview</DialogTitle></DialogHeader>
          {preview && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Sample Preview (variables filled):</div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {preview.content
                    .replace(/\{\{name\}\}/g, "Sarah")
                    .replace(/\{\{account\}\}/g, "@yourbrand")
                    .replace(/\{\{link\}\}/g, "https://example.com")
                    .replace(/\{\{topic\}\}/g, "fitness tips")
                    .replace(/\{\{gift_link\}\}/g, "https://example.com/gift")}
                </p>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Variables used:</div>
                <div className="flex flex-wrap gap-1">
                  {preview.variables.map((v) => <Badge key={v} variant="secondary" className="font-mono">{`{{${v}}}`}</Badge>)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
