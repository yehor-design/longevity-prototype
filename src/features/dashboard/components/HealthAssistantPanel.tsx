import { useState } from "react";
import { Send, Mic, MessageCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { chatMessages, suggestedQuestions } from "../data/mockData";

function PriorityAlert() {
  return (
    <Alert variant="error" className="rounded-xl">
      <AlertTriangle />
      <AlertTitle className="text-xs">Priority Alert</AlertTitle>
      <AlertDescription className="text-[11px] leading-4">
        Fasting Glucose at <strong>7.2 mmol/L</strong> — above clinical threshold
      </AlertDescription>
    </Alert>
  );
}

function UserMessage({ content, timestamp }: { content: string; timestamp?: string }) {
  return (
    <div className="flex flex-col items-end gap-1">
      {timestamp && (
        <span className="text-[10px] text-muted-foreground mr-1">{timestamp}</span>
      )}
      <div className="flex items-end gap-2">
        <div className="rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3 py-2 max-w-[85%]">
          <p className="text-sm leading-5">{content}</p>
        </div>
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
            EP
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex items-center justify-center size-7 rounded-full bg-primary/10 shrink-0">
        <MessageCircle size={14} className="text-primary" />
      </div>
      <div className="flex flex-col gap-3 max-w-[85%]">
        <p
          className="text-sm leading-5 text-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="flex flex-col gap-2">
          <Button className="w-full rounded-xl h-9 text-sm font-medium">
            Add both to plan
          </Button>
          <Button variant="outline" className="w-full rounded-xl h-9 text-sm font-medium">
            Show alternatives
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HealthAssistantPanel() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col h-full border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
          <MessageCircle size={20} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Health Assistant</span>
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-muted-foreground">Powered by AI</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Chat area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-4 p-4">
          {/* Greeting */}
          <p className="text-sm text-muted-foreground">
            Good afternoon, <strong className="text-foreground">Elena</strong>. Here&apos;s your
            health briefing.
          </p>

          {/* Priority alert */}
          <PriorityAlert />

          {/* Messages */}
          {chatMessages.map((msg) =>
            msg.role === "user" ? (
              <UserMessage key={msg.id} content={msg.content} timestamp={msg.timestamp} />
            ) : (
              <AssistantMessage key={msg.id} content={msg.content} />
            )
          )}
        </div>
      </ScrollArea>

      {/* Suggested questions */}
      <div className="px-4 pb-3 shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Suggested Questions
          </span>
          <Info size={12} className="text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q.id}
              className="flex items-start gap-2 text-left rounded-lg px-2 py-1.5 hover:bg-muted transition-colors group"
            >
              <MessageCircle
                size={12}
                className="text-primary shrink-0 mt-0.5"
              />
              <span className="text-xs text-foreground/80 leading-4 group-hover:text-foreground">
                {q.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3 shrink-0">
        <MessageCircle size={16} className="text-muted-foreground shrink-0" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about your health..."
          className="flex-1 border-0 shadow-none focus-visible:ring-0 h-8 text-sm px-0"
        />
        <Button variant="ghost" size="icon" className="size-7 shrink-0">
          <Mic size={14} className="text-muted-foreground" />
        </Button>
        <Button size="icon" className="size-7 shrink-0 rounded-full">
          <Send size={14} />
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-2 shrink-0">
        <p className="text-[9px] text-muted-foreground text-center leading-3">
          AI-powered insights are advisory — always consult your physician.
        </p>
      </div>
    </div>
  );
}
