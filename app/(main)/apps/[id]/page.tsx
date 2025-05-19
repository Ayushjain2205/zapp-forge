import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppOnlyOutputClient from "./AppOnlyOutput.client";
import type { Chat, Message } from "../../chats/[id]/page";

export default async function AppViewPage(props: { params: { id: string } }) {
  const { params } = await props;
  const prisma = getPrisma();
  const chat = await prisma.chat.findFirst({
    where: { id: params.id },
    include: { messages: { orderBy: { position: "asc" } } },
  });
  if (!chat) notFound();
  const assistantMessage = chat.messages
    .filter((m: Message) => m.role === "assistant")
    .at(-1);
  if (!assistantMessage) {
    return (
      <div className="flex h-screen items-center justify-center">
        No app output found.
      </div>
    );
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <AppOnlyOutputClient assistantMessage={assistantMessage as Message} />
    </div>
  );
}
