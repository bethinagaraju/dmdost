import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Send, Bot, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { messageService } from "@/services";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/constants/mockData";
import { timeAgo } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedConv, setSelectedConv] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filtered = conversations.filter((c) => {
    const matchSearch = c.participant.name.toLowerCase().includes(search.toLowerCase()) || c.participant.username.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "unread" && c.unreadCount > 0);
    return matchSearch && matchFilter;
  });

  const activeMessages = messages.filter((m) => m.conversationId === selectedConv?.id);

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConv(conv);
    setConversations((prev) => prev.map((c) => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSend = async () => {
    if (!replyText.trim() || !selectedConv) return;
    setIsSending(true);
    await messageService.send(selectedConv.id, replyText);
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConv.id,
      senderId: "ig_01",
      senderName: "alexjohnson_official",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ig1",
      content: replyText,
      timestamp: new Date().toISOString(),
      isRead: true,
      isAutomated: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) => prev.map((c) => c.id === selectedConv.id ? { ...c, lastMessage: replyText, lastMessageTime: newMsg.timestamp } : c));
    setReplyText("");
    showToast("Message sent!", "success");
    setIsSending(false);
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalUnread > 0 ? `${totalUnread} unread messages` : "All messages read"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "560px" }}>
        <div className="flex h-full">
          {/* Conversations sidebar */}
          <div className="w-80 border-r flex flex-col shrink-0">
            <div className="p-4 border-b space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-9">
                  <Filter className="size-3.5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b border-border/50",
                    selectedConv?.id === conv.id && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-10">
                      <AvatarImage src={conv.participant.avatar} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {conv.participant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn("text-sm font-medium truncate", conv.unreadCount > 0 && "font-semibold")}>{conv.participant.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{timeAgo(conv.lastMessageTime)}</span>
                    </div>
                    <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Message thread */}
          <div className="flex-1 flex flex-col">
            {selectedConv ? (
              <>
                {/* Thread header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={selectedConv.participant.avatar} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {selectedConv.participant.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{selectedConv.participant.name}</div>
                    <div className="text-xs text-muted-foreground">@{selectedConv.participant.username}</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      No messages in this conversation yet
                    </div>
                  )}
                  {activeMessages.map((msg, i) => {
                    const isMine = msg.senderId.startsWith("ig_");
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn("flex gap-2 max-w-[75%]", isMine ? "ml-auto flex-row-reverse" : "")}
                      >
                        {!isMine && (
                          <Avatar className="size-7 shrink-0">
                            <AvatarImage src={msg.senderAvatar} />
                            <AvatarFallback className="text-[10px]">{msg.senderName[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className={cn(
                            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                            isMine
                              ? "gradient-brand text-white rounded-tr-sm"
                              : "bg-muted rounded-tl-sm"
                          )}>
                            {msg.content}
                          </div>
                          <div className={cn("flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground", isMine ? "justify-end" : "")}>
                            {msg.isAutomated && (
                              <span className="flex items-center gap-0.5 text-primary">
                                <Bot className="size-2.5" />Auto
                              </span>
                            )}
                            <span>{timeAgo(msg.timestamp)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Reply input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Reply to ${selectedConv.participant.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={isSending || !replyText.trim()} className="gradient-brand text-white border-0 hover:opacity-90 shrink-0">
                      <Send className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Press Enter to send</p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <User className="size-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
