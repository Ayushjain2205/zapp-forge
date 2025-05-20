/* eslint-disable @next/next/no-img-element */
"use client";

import Fieldset from "@/components/fieldset";
import ArrowRightIcon from "@/components/icons/arrow-right";
import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LoadingButton from "@/components/loading-button";
import Spinner from "@/components/spinner";
import bgImg from "@/public/halo.png";
import * as Select from "@radix-ui/react-select";
import assert from "assert";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, useRef, useTransition, useEffect } from "react";
import { createChat, getAllChats } from "./actions";
import { Context } from "./providers";
import Header from "@/components/header";
import { useS3Upload } from "next-s3-upload";
import UploadIcon from "@/components/icons/upload-icon";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { MODELS, SUGGESTED_PROMPTS } from "@/lib/constants";

// Add type for Chat
interface Chat {
  id: string;
  model: string;
  quality: string;
  prompt: string;
  title: string;
  createdAt: string;
}

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [quality, setQuality] = useState("high");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const selectedModel = MODELS.find((m) => m.value === model);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const { uploadToS3 } = useS3Upload();
  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    setQuality("low");
    setScreenshotLoading(true);
    let file = event.target.files[0];
    const { url } = await uploadToS3(file);
    setScreenshotUrl(url);
    setScreenshotLoading(false);
  };

  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getAllChats();
      setChats(
        result.map((chat: any) => ({
          ...chat,
          createdAt:
            typeof chat.createdAt === "string"
              ? chat.createdAt
              : chat.createdAt.toISOString(),
        })),
      );
      setLoadingApps(false);
    })();
  }, []);

  return (
    <div className="bg-gradient-radial font-body min-h-screen from-purple-950 via-purple-900/30 to-black text-white">
      {/* Header */}
      <header className="absolute left-0 top-0 z-50 w-full px-6 py-4">
        <div className="flex items-center">
          <div className="relative h-12 w-12">
            <Image
              src="/new-logo.png"
              alt="ZapForge Logo"
              width={48}
              height={48}
              priority
              className="object-contain"
            />
          </div>
          <span className="font-heading font-heading ml-2 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-xl font-bold text-transparent">
            ZAP<span className="font-heading text-purple-400">FORGE</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        {/* Digital code rain effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="code-rain">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="code-column"
                style={{
                  left: `${(i / 15) * 100}%`,
                  animationDuration: `${Math.random() * 10 + 15}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              >
                {[...Array(20)].map((_, j) => (
                  <div
                    key={j}
                    className="code-character font-mono"
                    style={{
                      animationDuration: `${Math.random() * 2 + 1}s`,
                      animationDelay: `${Math.random() * 2}s`,
                      color:
                        j % 5 === 0
                          ? "#FFD700"
                          : j % 7 === 0
                            ? "#9333EA"
                            : "#6B21A8",
                    }}
                  >
                    {String.fromCharCode(Math.floor(Math.random() * 74) + 48)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          {/* Hero Heading */}
          <h1 className="font-heading mb-12 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="font-heading text-white">Transform your </span>
            <span className="font-heading bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              vision
            </span>
            <br />
            <span className="font-heading text-white">into </span>
            <span className="font-heading bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              reality
            </span>
          </h1>

          {/* Prompt Box */}
          <form
            className="relative mx-auto max-w-3xl"
            action={async (formData) => {
              startTransition(async () => {
                const { prompt, model, quality } = Object.fromEntries(formData);

                assert.ok(typeof prompt === "string");
                assert.ok(typeof model === "string");
                assert.ok(quality === "high" || quality === "low");

                const { chatId, lastMessageId } = await createChat(
                  prompt,
                  model,
                  quality,
                  screenshotUrl,
                );

                const streamPromise = fetch(
                  "/api/get-next-completion-stream-promise",
                  {
                    method: "POST",
                    body: JSON.stringify({ messageId: lastMessageId, model }),
                  },
                ).then((res) => {
                  if (!res.body) {
                    throw new Error("No body on response");
                  }
                  return res.body;
                });

                startTransition(() => {
                  setStreamPromise(streamPromise);
                  router.push(`/chats/${chatId}`);
                });
              });
            }}
          >
            {/* Glow effect behind prompt box */}
            <div className="absolute -inset-6 rounded-xl bg-gradient-to-r from-purple-600/30 to-yellow-400/30 opacity-70 blur-xl"></div>
            <div className="heat-distortion relative mb-8 overflow-hidden rounded-xl border border-purple-800 bg-zinc-900/70 p-6 shadow-2xl shadow-purple-600/20 backdrop-blur-md">
              {/* Heat distortion effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent opacity-30"></div>
              <div className="relative">
                <div className="p-3">
                  <p className="font-body invisible w-full whitespace-pre-wrap">
                    {textareaResizePrompt}
                  </p>
                </div>
                <textarea
                  placeholder="Describe your app idea in detail..."
                  required
                  name="prompt"
                  rows={1}
                  className="font-display peer absolute inset-0 min-h-[150px] w-full resize-none rounded-lg border-zinc-700 bg-transparent bg-zinc-800/50 p-3 px-4 py-4 text-lg text-white placeholder-gray-500 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-purple-500 disabled:opacity-50"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      const target = event.target;
                      if (!(target instanceof HTMLTextAreaElement)) return;
                      target.closest("form")?.requestSubmit();
                    }
                  }}
                />
                {/* Screenshot preview */}
                {screenshotLoading && (
                  <div className="relative mx-3 mt-3">
                    <div className="rounded-xl">
                      <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-200">
                        <Spinner />
                      </div>
                    </div>
                  </div>
                )}
                {screenshotUrl && (
                  <div className={`relative mx-3 mt-3`}>
                    <div className="rounded-xl">
                      <img
                        alt="screenshot"
                        src={screenshotUrl}
                        className="group relative mb-2 h-16 w-[68px] rounded"
                      />
                    </div>
                    <button
                      type="button"
                      id="x-circle-icon"
                      className="absolute -right-3 -top-4 left-14 z-10 size-5 rounded-full bg-white text-gray-900 hover:text-gray-500"
                      onClick={() => {
                        setScreenshotUrl(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <XCircleIcon />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-700/50 pt-4">
                <div className="flex items-center gap-3">
                  <Select.Root
                    name="model"
                    value={model}
                    onValueChange={setModel}
                  >
                    <Select.Trigger className="font-display inline-flex w-[180px] items-center gap-1 rounded-md border-zinc-700 bg-zinc-800/70 p-1 text-sm text-gray-400 text-zinc-300 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
                      <Select.Value aria-label={model}>
                        <span className="font-display">
                          {selectedModel?.label}
                        </span>
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border-zinc-700 bg-white bg-zinc-800 shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {MODELS.map((m) => (
                            <Select.Item
                              key={m.value}
                              value={m.value}
                              className="font-display flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none"
                            >
                              <Select.ItemText className="font-display inline-flex items-center gap-2 text-gray-500">
                                {m.label}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="size-3 text-blue-600" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="h-4 w-px bg-gray-200 max-sm:hidden" />
                  <Select.Root
                    name="quality"
                    value={quality}
                    onValueChange={setQuality}
                  >
                    <Select.Trigger className="font-display inline-flex items-center gap-1 rounded p-1 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
                      <Select.Value aria-label={quality}>
                        <span className="font-display max-sm:hidden">
                          {quality === "low"
                            ? "Low quality [faster]"
                            : "High quality [slower]"}
                        </span>
                        <span className="sm:hidden">
                          <LightningBoltIcon className="size-3" />
                        </span>
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md bg-white shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {[
                            { value: "low", label: "Low quality [faster]" },
                            {
                              value: "high",
                              label: "High quality [slower]",
                            },
                          ].map((q) => (
                            <Select.Item
                              key={q.value}
                              value={q.value}
                              className="font-display flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none"
                            >
                              <Select.ItemText className="font-display inline-flex items-center gap-2 text-gray-500">
                                {q.label}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="size-3 text-blue-600" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="h-4 w-px bg-gray-200 max-sm:hidden" />
                  <div>
                    <label
                      htmlFor="screenshot"
                      className="font-display flex cursor-pointer gap-2 text-sm text-gray-400 hover:underline"
                    >
                      <div className="flex size-6 items-center justify-center rounded bg-black hover:bg-gray-700">
                        <UploadIcon className="size-4" />
                      </div>
                      <div className="font-display flex items-center justify-center transition hover:text-gray-700">
                        Attach
                      </div>
                    </label>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>
                <div className="relative flex shrink-0 has-[:disabled]:opacity-50">
                  <div className="pointer-events-none absolute inset-0 -bottom-[1px] rounded bg-blue-500" />
                  <LoadingButton
                    className="font-display relative inline-flex size-6 items-center justify-center rounded bg-blue-500 font-medium text-white shadow-lg outline-blue-300 hover:bg-blue-500/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    type="submit"
                  >
                    <ArrowRightIcon />
                  </LoadingButton>
                </div>
              </div>
              {isPending && (
                <LoadingMessage
                  isHighQuality={quality === "high"}
                  screenshotUrl={screenshotUrl}
                />
              )}
              {/* Molten metal effect at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 animate-pulse bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
            </div>
            {/* Suggestion Chips */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((v) => (
                <button
                  key={v.title}
                  type="button"
                  onClick={() => setPrompt(v.description)}
                  className="font-display flex items-center gap-1.5 rounded-full border border-purple-800 bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  {v.title}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Top Zapps Section */}
      <section className="border-b border-t border-purple-800/50 bg-black/40 px-4 py-16 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Top Zapps</h2>
            <button className="font-display text-sm font-medium text-yellow-400 hover:text-yellow-500">
              View All
            </button>
          </div>
          {loadingApps ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {chats.slice(0, 8).map((chat) => (
                <div
                  key={chat.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/apps/${chat.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/apps/${chat.id}`);
                    }
                  }}
                >
                  <div className="relative mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-purple-800 bg-zinc-900/50">
                    {/* Placeholder image or screenshot if available in future */}
                    <span className="font-display text-2xl font-bold text-zinc-500">
                      {chat.title?.slice(0, 2) || chat.prompt.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display truncate text-sm text-zinc-400">
                      {chat.title || chat.prompt}
                    </span>
                    <span className="font-display text-xs text-zinc-500">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <button className="font-display rounded border border-purple-700 px-4 py-2 text-zinc-300 hover:bg-purple-900/50">
              Show More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoadingMessage({
  isHighQuality,
  screenshotUrl,
}: {
  isHighQuality: boolean;
  screenshotUrl: string | undefined;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white px-1 py-3 md:px-3">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="animate-pulse text-balance text-center text-sm md:text-base">
          {isHighQuality
            ? `Coming up with project plan, may take 15 seconds...`
            : screenshotUrl
              ? "Analyzing your screenshot..."
              : `Creating your app...`}
        </span>
        <Spinner />
      </div>
    </div>
  );
}

export const runtime = "edge";
export const maxDuration = 45;
