"use client";

import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import Image from "next/image";

import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";
import { CDN_ASSETS } from "@/lib/constants";

export const PreviewMessage = ({
  message,
  append,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
  append?: (message: any) => Promise<string | null | undefined>;
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl group/message"
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      data-role={message.role}
    >
      <div className={cn("flex gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
        {/* Assistant avatar */}
        {!isUser && (
          <div className="relative h-8 w-8 shrink-0 rounded-lg p-[1px] bg-gradient-to-br from-cyan to-violet">
            <div className="h-full w-full rounded-[7px] bg-substrate flex items-center justify-center">
              <span className="font-display text-[11px] font-semibold text-cyan">AI</span>
            </div>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "relative flex flex-col gap-2 max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-xl",
            isUser
              ? "bg-gradient-to-br from-cyan/15 via-violet/10 to-substrate/80 border border-cyan/25 text-foam shadow-glass"
              : "glass border border-cyan/10 text-foam"
          )}
        >
          {/* Side accent bar for assistant */}
          {!isUser && (
            <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r bg-gradient-to-b from-cyan via-violet to-transparent" />
          )}

          {/* Role tag */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-[9px] tracking-[0.32em] uppercase",
                isUser ? "text-cyan" : "text-ash"
              )}
            >
              {isUser ? "YOU" : "AI · TWIN"}
            </span>
            <span className="h-px flex-1 bg-cyan/10" />
          </div>

          {message.parts && message.parts.length > 0 && (
            <div className="flex flex-col gap-3">
              {message.parts.map((part: any, index: number) => {
                if (part.type === "text" && part.text) {
                  return (
                    <div key={index} className="text-foam leading-relaxed">
                      <Markdown
                        variant="chat"
                        onQuestionClick={(question) => {
                          append?.({ role: "user", content: question });
                        }}
                      >
                        {part.text}
                      </Markdown>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="h-8 w-8 overflow-hidden rounded-lg ring-1 ring-cyan/30 shrink-0">
            <Image
              src={CDN_ASSETS.PROFILE_PHOTO}
              alt="User"
              width={32}
              height={32}
              className="w-full h-full object-cover saturate-[0.85]"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      data-role="assistant"
    >
      <div className="flex gap-3 w-full justify-start">
        <div className="relative h-8 w-8 shrink-0 rounded-lg p-[1px] bg-gradient-to-br from-cyan to-violet">
          <div className="h-full w-full rounded-[7px] bg-substrate flex items-center justify-center">
            <span className="font-display text-[11px] font-semibold text-cyan">AI</span>
          </div>
        </div>

        <div className="glass rounded-xl px-4 py-3 border border-cyan/10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.32em] text-ash uppercase">
              PROCESSING
            </span>
            <div className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse-dot"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
            <span className="font-mono text-[10px] text-cyan tracking-[0.18em] uppercase">
              streaming…
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
