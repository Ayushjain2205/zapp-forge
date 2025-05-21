"use client";

import { createContext, ReactNode, useState } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Context = createContext<{
  streamPromise?: Promise<ReadableStream>;
  setStreamPromise: (v: Promise<ReadableStream> | undefined) => void;
}>({
  setStreamPromise: () => {},
});

// NERO Chain Testnet config
const neroTestnet = {
  id: 689,
  name: "NERO Chain Testnet",
  nativeCurrency: {
    name: "NERO",
    symbol: "NERO",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc-testnet.nerochain.io"] },
    public: { http: ["https://rpc-testnet.nerochain.io"] },
  },
  blockExplorers: {
    default: { name: "NeroScan", url: "https://testnet.neroscan.io" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "ZappForge",
  projectId: "zappforge-nero", // You can use any string here
  chains: [neroTestnet],
  transports: {
    [neroTestnet.id]: http("https://rpc-testnet.nerochain.io"),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const [streamPromise, setStreamPromise] = useState<Promise<ReadableStream>>();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Context value={{ streamPromise, setStreamPromise }}>
            {children}
          </Context>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
