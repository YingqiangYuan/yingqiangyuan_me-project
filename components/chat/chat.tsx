"use client";

import { PreviewMessage, ThinkingMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function Chat() {
  const chatId = "001";

  const [input, setInput] = useState("");
  const [isContextBannerVisible, setIsContextBannerVisible] = useState(true);

  const browserFingerprintRef = useRef<string>("");

  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        browserFingerprintRef.current = result.visitorId;
        console.log('Browser Fingerprint Generated:', result.visitorId);
      } catch (error) {
        console.error('Failed to generate browser fingerprint:', error);
      }
    };

    generateFingerprint();

    const originalFetch = window.fetch;
    window.fetch = async (input, init?) => {
      if (typeof input === 'string' && input.includes('/api/chat')) {
        const fingerprint = browserFingerprintRef.current;
        init = init || {};
        init.headers = {
          ...init.headers,
          'X-Client-Fingerprint': fingerprint,
        };
      }
      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
  } = useChat({
    onError: (error) => {
      if (error.message.includes("Too many requests") || error.message.includes("Rate limit") || error.message.includes("429")) {
        toast.error(
          "You have reached the usage limit, please try again in 60 minutes",
          { duration: 8000 }
        );
      } else {
        toast.error(error.message);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e?: { preventDefault?: () => void }, options?: any) => {
    e?.preventDefault?.();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const append = async (message: any): Promise<string | null | undefined> => {
    if (message.content) {
      await sendMessage({ text: message.content });
      return null;
    } else if (message.text) {
      await sendMessage({ text: message.text });
      return null;
    }
    return null;
  };

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [messages.length]);

  return (
    <div className="relative flex flex-col min-w-0 h-[calc(100dvh-64px)]">
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-4 flex-1 overflow-y-scroll pt-6 pb-2 px-4"
      >
        {/* Welcome card */}
        {messages.length === 0 && <Overview />}

        {/* Context banner */}
        {messages.length > 0 && isContextBannerVisible && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative glass rounded-xl p-4 panel-edge">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative h-9 w-9 shrink-0 rounded-lg p-[1px] bg-gradient-to-br from-cyan to-violet">
                    <div className="h-full w-full rounded-[7px] bg-substrate flex items-center justify-center">
                      <span className="font-display text-xs font-semibold text-cyan">
                        AI
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-[11px] tracking-[0.3em] text-foam uppercase">
                        AI TWIN
                      </h3>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.28em] text-mint uppercase">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-ash mt-1">
                      Helping you understand{" "}
                      <span className="text-cyan font-medium">Yingqiang Yuan</span>&apos;s
                      work. Every answer is grounded in his real projects.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsContextBannerVisible(false)}
                  className="text-ash hover:text-foam transition-colors shrink-0 cursor-pointer"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
            append={append}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      <div className="relative px-4 pb-5 pt-3">
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
        <form className="flex mx-auto gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={chatId}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </div>
  );
}
