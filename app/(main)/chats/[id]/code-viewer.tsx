"use client";

import ChevronLeftIcon from "@/components/icons/chevron-left";
import ChevronRightIcon from "@/components/icons/chevron-right";
import CloseIcon from "@/components/icons/close-icon";
import RefreshIcon from "@/components/icons/refresh";
import { extractFirstCodeBlock, splitByFirstCodeFence } from "@/lib/utils";
import { useState } from "react";
import type { Chat, Message } from "./page";
import { Share } from "./share";
import { StickToBottom } from "use-stick-to-bottom";
import dynamic from "next/dynamic";
import ShareIcon from "@/components/icons/share-icon";

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
});
const SyntaxHighlighter = dynamic(
  () => import("@/components/syntax-highlighter"),
  {
    ssr: false,
  },
);

export default function CodeViewer({
  chat,
  streamText,
  message,
  onMessageChange,
  activeTab,
  onTabChange,
  onClose,
  onRequestFix,
}: {
  chat: Chat;
  streamText: string;
  message?: Message;
  onMessageChange: (v: Message) => void;
  activeTab: string;
  onTabChange: (v: "code" | "preview") => void;
  onClose: () => void;
  onRequestFix: (e: string) => void;
}) {
  const app = message ? extractFirstCodeBlock(message.content) : undefined;
  const streamAppParts = splitByFirstCodeFence(streamText);
  const streamApp = streamAppParts.find(
    (p) =>
      p.type === "first-code-fence-generating" || p.type === "first-code-fence",
  );
  const streamAppIsGenerating = streamAppParts.some(
    (p) => p.type === "first-code-fence-generating",
  );

  const code = streamApp ? streamApp.content : app?.code || "";
  const language = streamApp ? streamApp.language : app?.language || "";
  const title = streamApp ? streamApp.filename.name : app?.filename?.name || "";
  const layout = ["python", "ts", "js", "javascript", "typescript"].includes(
    language,
  )
    ? "two-up"
    : "tabbed";

  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");
  const currentVersion = streamApp
    ? assistantMessages.length
    : message
      ? assistantMessages.map((m) => m.id).indexOf(message.id)
      : 1;
  const previousMessage =
    currentVersion !== 0 ? assistantMessages.at(currentVersion - 1) : undefined;
  const nextMessage =
    currentVersion < assistantMessages.length
      ? assistantMessages.at(currentVersion + 1)
      : undefined;

  const [refresh, setRefresh] = useState(0);

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between rounded-tl-2xl border-b-2 border-purple-800 bg-zinc-900/80 px-4">
        <div className="inline-flex items-center gap-4">
          <button
            className="text-zinc-300 hover:text-yellow-400"
            onClick={onClose}
          >
            <CloseIcon className="size-5" />
          </button>
          <span className="font-heading text-white">
            {title} v{currentVersion + 1}
          </span>
        </div>
        {layout === "tabbed" && (
          <div className="flex rounded-lg border-2 border-purple-800 bg-zinc-900/70 p-1">
            <button
              onClick={() => onTabChange("code")}
              data-active={activeTab === "code" ? true : undefined}
              className={`font-heading inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium transition-colors ${activeTab === "code" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900" : "bg-zinc-900/70 text-zinc-300 hover:bg-zinc-800"}`}
            >
              Code
            </button>
            <button
              onClick={() => onTabChange("preview")}
              data-active={activeTab === "preview" ? true : undefined}
              className={`font-heading inline-flex h-7 w-16 items-center justify-center rounded text-xs font-medium transition-colors ${activeTab === "preview" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900" : "bg-zinc-900/70 text-zinc-300 hover:bg-zinc-800"}`}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {layout === "tabbed" ? (
        <div className="flex grow flex-col overflow-y-auto bg-white text-black">
          {activeTab === "code" ? (
            <StickToBottom
              className="relative grow overflow-hidden px-6 py-4"
              resize="smooth"
              initial={streamAppIsGenerating ? "smooth" : false}
            >
              <StickToBottom.Content>
                <SyntaxHighlighter code={code} language={language} />
              </StickToBottom.Content>
            </StickToBottom>
          ) : (
            <>
              {language && (
                <div className="flex h-full items-center justify-center px-6 py-4">
                  <CodeRunner
                    onRequestFix={onRequestFix}
                    language={language}
                    code={code}
                    key={refresh}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex grow flex-col bg-zinc-900/80">
          <div className="h-1/2 overflow-y-auto">
            <SyntaxHighlighter code={code} language={language} />
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="font-heading border-t border-purple-800 bg-zinc-900/70 px-4 py-4 text-zinc-300">
              Output
            </div>
            <div className="flex grow items-center justify-center border-t border-purple-800">
              {!streamAppIsGenerating && (
                <CodeRunner
                  onRequestFix={onRequestFix}
                  language={language}
                  code={code}
                  key={refresh}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-bl-2xl border-t-2 border-purple-800 bg-zinc-900/80 px-4 py-4">
        <div className="font-heading inline-flex items-center gap-2.5 text-sm text-zinc-500">
          <form className="flex">
            <button
              type="submit"
              disabled={!message}
              className="inline-flex items-center gap-1 rounded border border-purple-800 bg-white px-2 py-1 text-sm text-zinc-700 shadow-sm transition-colors hover:bg-yellow-400 hover:text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:opacity-50"
              style={{ fontWeight: 500 }}
              onClick={(e) => {
                e.preventDefault();
                if (message) {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/share/v2/${message.id}`,
                  );
                }
              }}
            >
              <ShareIcon className="size-3" />
              Share
            </button>
          </form>
          <button
            className="inline-flex items-center gap-1 rounded border border-purple-800 bg-white px-2 py-1 text-sm text-zinc-700 shadow-sm transition-colors hover:bg-yellow-400 hover:text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            style={{ fontWeight: 500 }}
            onClick={() => setRefresh((r) => r + 1)}
          >
            <RefreshIcon className="size-3" />
            Refresh
          </button>
        </div>
        <div className="flex items-center justify-end gap-3">
          {previousMessage ? (
            <button
              className="text-white hover:text-yellow-400"
              onClick={() => onMessageChange(previousMessage)}
            >
              <ChevronLeftIcon className="size-4" />
            </button>
          ) : (
            <button className="text-zinc-300 opacity-25" disabled>
              <ChevronLeftIcon className="size-4" />
            </button>
          )}

          <p className="font-heading text-sm text-zinc-300">
            Version <span className="tabular-nums">{currentVersion + 1}</span>{" "}
            <span className="text-zinc-300">of</span>{" "}
            <span className="tabular-nums">
              {Math.max(currentVersion + 1, assistantMessages.length)}
            </span>
          </p>

          {nextMessage ? (
            <button
              className="text-white hover:text-yellow-400"
              onClick={() => onMessageChange(nextMessage)}
            >
              <ChevronRightIcon className="size-4" />
            </button>
          ) : (
            <button className="text-zinc-300 opacity-25" disabled>
              <ChevronRightIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
