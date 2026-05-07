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
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "flex gap-3 w-full",
          message.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        {/* AI Assistant Avatar - Left side */}
        {message.role === "assistant" && (
          <div className="w-8 h-8 flex items-center justify-center bg-accent shrink-0">
            <span className="font-display text-xs text-white">AI</span>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] p-4",
            message.role === "user"
              ? "bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white"
              : "bg-white dark:bg-black border-2 border-black dark:border-white"
          )}
        >
          {/* AI SDK v5: Use parts instead of content */}
          {message.parts && message.parts.length > 0 && (
            <div className="flex flex-col gap-4">
              {message.parts.map((part: any, index: number) => {
                if (part.type === 'text' && part.text) {
                  return (
                    <div
                      key={index}
                      className={cn(
                        message.role === "assistant"
                          ? "text-black dark:text-white"
                          : "text-white dark:text-black"
                      )}
                    >
                      <Markdown
                        variant="chat"
                        onQuestionClick={(question) => {
                          append?.({
                            role: 'user',
                            content: question,
                          });
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

        {/* User Avatar - Right side */}
        {message.role === "user" && (
          <div className="w-8 h-8 overflow-hidden border-2 border-black dark:border-white shrink-0">
            <Image
              src={CDN_ASSETS.PROFILE_PHOTO}
              alt="User Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div className="flex gap-3 w-full justify-start">
        <div className="w-8 h-8 flex items-center justify-center bg-accent shrink-0">
          <span className="font-display text-xs text-white">AI</span>
        </div>

        <div className="p-4 bg-white dark:bg-black border-2 border-black dark:border-white">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="inline-block w-2 h-2 bg-accent animate-pulse" />
            <span className="font-display text-sm uppercase">THINKING...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
