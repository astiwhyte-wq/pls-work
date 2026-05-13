import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  useListMessages, useSendMessage, useDeleteMessage,
  getListMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const { isApproved, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();

  useEffect(() => {
    if (!isLoading && !isApproved) {
      setLocation("/pending");
    }
  }, [isApproved, isLoading, setLocation]);

  const { data: messages } = useListMessages({ limit: 100 }, {
    query: { queryKey: getListMessagesQueryKey({ limit: 100 }) },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ limit: 100 }) });
    }, 3000);
    return () => clearInterval(interval);
  }, [queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isTimed = () => {
    if (!user?.chatTimeoutUntil) return false;
    return new Date(user.chatTimeoutUntil as unknown as string) > new Date();
  };

  const timeoutLabel = () => {
    if (!user?.chatTimeoutUntil) return "";
    const d = new Date(user.chatTimeoutUntil as unknown as string);
    if (d.getFullYear() >= 9999) return "permanently";
    const diff = Math.max(0, d.getTime() - Date.now());
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (mins > 60) return `until ${d.toLocaleTimeString()}`;
    return `${mins}m ${secs}s`;
  };

  const handleSend = () => {
    const content = message.trim();
    if (!content) return;
    setSendError(null);
    sendMessage.mutate({ data: { content } }, {
      onSuccess: () => {
        setMessage("");
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ limit: 100 }) });
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error ?? "Failed to send";
        setSendError(msg);
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteMessage.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ limit: 100 }) });
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const timed = isTimed();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold glow-text">&gt; COMMS_CHANNEL_</h1>
          <p className="text-primary/40 text-xs font-mono uppercase tracking-widest">Encrypted — members only</p>
        </div>

        {timed && (
          <div className="mb-4 px-4 py-3 border border-destructive/40 bg-destructive/10 text-destructive text-xs font-mono uppercase">
            &gt; CHAT_TIMEOUT: You are silenced {timeoutLabel()}. You cannot send messages.
          </div>
        )}

        <div className="flex-1 border border-primary/20 bg-card/50 flex flex-col" style={{ minHeight: "500px" }}>
          <div className="border-b border-primary/20 px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary/60 text-xs font-mono uppercase">Live — updates every 3s</span>
            {user?.role === "admin" && (
              <span className="ml-auto text-xs text-destructive font-mono uppercase">[ADMIN: click msg to delete]</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm" style={{ maxHeight: "480px" }}>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 group ${msg.userId === user?.id ? "flex-row-reverse" : ""}`}
                  data-testid={`message-${msg.id}`}
                >
                  <div className={`flex flex-col ${msg.userId === user?.id ? "items-end" : "items-start"} max-w-xs md:max-w-md`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs ${msg.userId === user?.id ? "text-primary" : "text-primary/60"} uppercase`}>
                        {msg.userId === user?.id ? "YOU" : msg.displayName}
                      </span>
                      <span className="text-primary/30 text-xs">{formatTime(msg.createdAt as unknown as string)}</span>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive text-xs px-1 border border-destructive/30 hover:border-destructive/60"
                          title="Delete message"
                          data-testid={`button-delete-msg-${msg.id}`}
                        >
                          DEL
                        </button>
                      )}
                    </div>
                    <div className={`px-3 py-2 border text-xs ${msg.userId === user?.id ? "border-primary/40 bg-primary/10 text-primary" : "border-primary/20 bg-card text-foreground/80"}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-primary/30">
                <p>&gt; No messages yet. Say something_</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary/20 p-4 space-y-2">
            {sendError && (
              <p className="text-destructive text-xs font-mono">&gt; ERROR: {sendError}</p>
            )}
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={timed ? "You are timed out from chat..." : "type_message... (Enter to send)"}
                className="flex-1 bg-background border-primary/30 focus:border-primary font-mono text-sm disabled:opacity-50"
                disabled={sendMessage.isPending || timed}
                data-testid="input-message"
              />
              <Button
                onClick={handleSend}
                disabled={sendMessage.isPending || !message.trim() || timed}
                className="bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 glow-border text-xs"
                data-testid="button-send"
              >
                SEND
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
