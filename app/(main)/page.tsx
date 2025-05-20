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
import { ZappCard, ZappIcons, ZappProject } from "@/components/ZappCard";

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
              src="/new_logo.png"
              alt="ZapForge Logo"
              width={48}
              height={48}
              priority
              className="object-contain"
            />
          </div>
          <span className="font-heading ml-2 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-xl font-bold text-transparent">
            ZAPP<span className="font-heading text-purple-400">FORGE</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col justify-center px-4 pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        {/* Digital code rain effect */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
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

        <div className="container relative z-20 mx-auto max-w-4xl text-center">
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
            className="relative z-20 mx-auto max-w-3xl"
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
            {/* Glow and heat distortion overlays behind prompt box */}
            <div
              className="pointer-events-none absolute -inset-6 z-10 rounded-xl bg-gradient-to-r from-purple-600/30 to-yellow-400/30 opacity-70 blur-xl"
              style={{ zIndex: 10 }}
            ></div>
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-purple-600/5 to-transparent opacity-30"
              style={{ zIndex: 10 }}
            ></div>
            <div className="heat-distortion relative z-20 mb-8 overflow-hidden rounded-xl border border-purple-800 bg-zinc-900/80 p-6 shadow-2xl shadow-purple-600/20 backdrop-blur-md">
              <div className="flex flex-col">
                <textarea
                  placeholder="Describe your app idea in detail..."
                  required
                  name="prompt"
                  rows={4}
                  className="font-display min-h-[150px] w-full resize-none rounded-xl border-none bg-zinc-900/80 p-4 text-lg text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50"
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
                  <div className="relative z-20 mx-3 mt-3">
                    <div className="rounded-xl">
                      <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-200">
                        <Spinner />
                      </div>
                    </div>
                  </div>
                )}
                {screenshotUrl && (
                  <div className={`relative z-20 mx-3 mt-3`}>
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
                      className="absolute -right-3 -top-4 left-14 z-30 size-5 rounded-full bg-white text-gray-900 hover:text-gray-500"
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
              <div className="z-20 mt-4 flex items-center justify-between border-t border-zinc-700/50 pt-4">
                <div className="flex items-center gap-3">
                  <Select.Root
                    name="model"
                    value={model}
                    onValueChange={setModel}
                  >
                    <Select.Trigger
                      className="font-display z-30 inline-flex w-[180px] items-center gap-1 rounded-md border-zinc-900/70 bg-zinc-900/70 p-1 text-sm text-gray-400 hover:bg-zinc-900/80 hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                      tabIndex={0}
                      style={{ zIndex: 30 }}
                    >
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
                      <Select.Content className="z-50 overflow-hidden rounded-md border-zinc-700 bg-zinc-900 shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {MODELS.map((m) => (
                            <Select.Item
                              key={m.value}
                              value={m.value}
                              className="font-display flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm transition-colors data-[highlighted]:bg-yellow-400/90 data-[highlighted]:font-bold data-[highlighted]:text-purple-900 data-[highlighted]:outline-none"
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
                    <Select.Trigger
                      className="font-display z-30 inline-flex items-center gap-1 rounded p-1 text-sm text-gray-400 hover:bg-zinc-900/80 hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                      tabIndex={0}
                      style={{ zIndex: 30 }}
                    >
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
                      <Select.Content className="z-50 overflow-hidden rounded-md bg-zinc-900 shadow ring-1 ring-black/5">
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
                              className="font-display flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm transition-colors data-[highlighted]:bg-yellow-400/90 data-[highlighted]:font-bold data-[highlighted]:text-purple-900 data-[highlighted]:outline-none"
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
                      className="font-display z-30 flex cursor-pointer gap-2 text-sm text-gray-400 hover:underline"
                      style={{ zIndex: 30 }}
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
                <div className="relative z-20 flex shrink-0 has-[:disabled]:opacity-50">
                  <button
                    type="submit"
                    className="font-heading flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-8 py-4 text-xl font-bold text-purple-900 shadow-lg transition-all duration-200 hover:from-yellow-400 hover:to-yellow-600 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    style={{ minWidth: 180 }}
                  >
                    <LightningBoltIcon className="h-7 w-7 text-purple-900" />
                    FORGE
                  </button>
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
            <div className="relative z-30 mb-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((v) => (
                <button
                  key={v.title}
                  type="button"
                  onClick={() => setPrompt(v.description)}
                  className="font-display z-30 flex items-center gap-1.5 rounded-full border border-purple-800 bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                  style={{ zIndex: 30 }}
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
              {chats.slice(0, 8).map((chat, idx) => {
                // Simple mapping for category/icon/gradient
                const categories = [
                  {
                    category: "Finance",
                    icon: (
                      <ZappIcons.Wallet className="h-4 w-4 text-yellow-200" />
                    ),
                    gradient: "from-yellow-500 to-orange-500",
                  },
                  {
                    category: "NFT",
                    icon: (
                      <ZappIcons.ImageIcon className="h-4 w-4 text-pink-200" />
                    ),
                    gradient: "from-pink-500 to-purple-600",
                  },
                  {
                    category: "Analytics",
                    icon: (
                      <ZappIcons.BarChart3 className="h-4 w-4 text-blue-200" />
                    ),
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    category: "DeFi",
                    icon: <ZappIcons.Zap className="h-4 w-4 text-green-200" />,
                    gradient: "from-green-400 to-emerald-500",
                  },
                  {
                    category: "Social",
                    icon: (
                      <ZappIcons.Users className="h-4 w-4 text-purple-200" />
                    ),
                    gradient: "from-purple-500 to-indigo-600",
                  },
                  {
                    category: "Metaverse",
                    icon: <ZappIcons.Boxes className="h-4 w-4 text-red-200" />,
                    gradient: "from-red-500 to-pink-500",
                  },
                  {
                    category: "Governance",
                    icon: (
                      <ZappIcons.Layout className="h-4 w-4 text-amber-200" />
                    ),
                    gradient: "from-amber-500 to-orange-600",
                  },
                  {
                    category: "Explorer",
                    icon: <ZappIcons.Globe className="h-4 w-4 text-teal-200" />,
                    gradient: "from-teal-400 to-cyan-500",
                  },
                ];
                const cat = categories[idx % categories.length];
                return (
                  <ZappCard
                    key={chat.id}
                    project={{
                      id: chat.id,
                      title: chat.title || chat.prompt.slice(0, 32),
                      creator: "0x0000000000000000000000000000000000000000", // Placeholder
                      category: cat.category,
                      icon: cat.icon,
                      gradient: cat.gradient,
                    }}
                  />
                );
              })}
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
