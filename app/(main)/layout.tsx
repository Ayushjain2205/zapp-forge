import Providers from "@/app/(main)/providers";
import { Toaster } from "@/components/ui/toaster";
import { Space_Grotesk, Orbitron, Barlow } from "next/font/google";

// Heading font - tech/futuristic feel
const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

// Display font - bold, industrial feel
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

// Body font - clean, readable
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${barlow.variable}`}
    >
      <body className="font-body min-h-screen">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
