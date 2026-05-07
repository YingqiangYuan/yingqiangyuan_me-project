"use client";

import type { ChatRequestOptions, UIMessage } from "ai";
import { motion } from "framer-motion";
import type React from "react";
import {
  useRef,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { cn, sanitizeUIMessages } from "@/lib/utils";

import { ArrowUpIcon, StopIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import suggestedActionsData from "@/data/suggested-actions.json";

const suggestedActions = suggestedActionsData;

export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: Dispatch<SetStateAction<Array<UIMessage>>>;
  append: (
    message: any,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {});
    setLocalStorageInput("");

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width]);

  return (
    <div className="relative w-full flex flex-col gap-3">
      {/* Suggested questions (only on empty chat) */}
      {messages.length === 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <span className="hud-label">[ SUGGESTED PROMPTS ]</span>
            <span className="h-px flex-1 bg-cyan/10" />
            <span className="font-mono text-[10px] tracking-[0.28em] text-ash uppercase">
              tap to send
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 w-full">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                key={`suggested-action-${suggestedAction.title}-${index}`}
              >
                <button
                  type="button"
                  onClick={async () => {
                    append({ role: "user", content: suggestedAction.action });
                  }}
                  className="group relative w-full text-left rounded-xl px-4 py-3 glass border border-cyan/10 hover:border-cyan/40 hover:shadow-glow-cyan transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-cyan uppercase">
                      / {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-ash uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      ⏎ SEND
                    </span>
                  </div>
                  <div className="mt-1.5 font-display text-sm text-foam tracking-tight">
                    {suggestedAction.title}
                  </div>
                  <div className="mt-0.5 text-xs text-ash leading-snug">
                    {suggestedAction.label}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Input shell */}
      <div
        className={cn(
          "relative panel-edge rounded-2xl glass-strong p-1.5",
          "transition-all duration-200 focus-within:shadow-glow-cyan focus-within:border-cyan/40"
        )}
      >
        {/* prompt prefix */}
        <div className="absolute top-3.5 left-4 flex items-center gap-2 pointer-events-none">
          <span className="font-mono text-cyan text-sm select-none">{">"}</span>
        </div>

        <Textarea
          ref={textareaRef}
          placeholder="ask the ai twin · ⏎ to transmit"
          value={input}
          onChange={handleInput}
          className={cn(
            "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none !text-base",
            "bg-transparent border-0 rounded-xl",
            "focus:!ring-0 focus:!border-0 focus-visible:!ring-0 focus-visible:!ring-offset-0",
            "text-foam placeholder:text-ash/70 placeholder:lowercase placeholder:tracking-wide",
            "pl-9 pr-14 py-3",
            className,
          )}
          rows={3}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (isLoading) {
                toast.error("Please wait for the response to complete!");
              } else {
                submitForm();
              }
            }
          }}
        />

        {/* HUD footer */}
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.3em] text-ash uppercase">
            <span className="hidden sm:inline">⌘ + ⏎ NEWLINE</span>
            <span className="hidden sm:inline">·</span>
            <span>{input.length} CHR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-ash uppercase hidden sm:inline">
                ENCRYPTED
              </span>
            </div>
            {isLoading ? (
              <Button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  stop();
                  setMessages((messages) => sanitizeUIMessages(messages));
                }}
                className="h-9 w-9 p-0 rounded-lg bg-substrate hover:bg-trace text-foam border border-signal/40 hover:border-signal transition-all"
              >
                <StopIcon size={14} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  submitForm();
                }}
                disabled={input.length === 0}
                className={cn(
                  "h-9 w-9 p-0 rounded-lg border transition-all",
                  input.length === 0
                    ? "bg-substrate text-ash border-cyan/10 cursor-not-allowed"
                    : "bg-gradient-to-br from-cyan to-violet text-ink border-cyan/60 hover:shadow-glow-cyan"
                )}
              >
                <ArrowUpIcon size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
