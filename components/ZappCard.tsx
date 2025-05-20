import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Icon SVGs
const Wallet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="3"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="3"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="2"
      y="3"
      width="20"
      height="4"
      rx="2"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="2"
      y="3"
      width="20"
      height="4"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <circle cx="18" cy="14" r="2" fill="#fff" fillOpacity=".3" />
  </svg>
);
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="3"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="3"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <circle cx="8" cy="10" r="2" fill="#fff" fillOpacity=".3" />
    <path d="M21 19l-5.5-7-4.5 6-3-4-3 5" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
const BarChart3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="10"
      width="4"
      height="8"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="10"
      width="4"
      height="8"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="9"
      y="6"
      width="4"
      height="12"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="9"
      y="6"
      width="4"
      height="12"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="15"
      y="3"
      width="4"
      height="15"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="15"
      y="3"
      width="4"
      height="15"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Zap = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      fill="#fff"
      fillOpacity=".1"
    />
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Users = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="8" cy="8" r="4" fill="#fff" fillOpacity=".1" />
    <circle cx="8" cy="8" r="4" stroke="#fff" strokeWidth="1.5" />
    <circle cx="17" cy="13" r="3" fill="#fff" fillOpacity=".1" />
    <circle cx="17" cy="13" r="3" stroke="#fff" strokeWidth="1.5" />
    <path
      d="M2 21c0-3.314 3.134-6 7-6s7 2.686 7 6"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <path d="M14 21c0-2.21 2.239-4 5-4" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
const Boxes = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Layout = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="4"
      rx="1"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="4"
      rx="1"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="7"
      y="13"
      width="4"
      height="4"
      rx="1"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="7"
      y="13"
      width="4"
      height="4"
      rx="1"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="13"
      y="13"
      width="4"
      height="4"
      rx="1"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="13"
      y="13"
      width="4"
      height="4"
      rx="1"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".1" />
    <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="7" ry="10" stroke="#fff" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

export type ZappProject = {
  id: number | string;
  title: string;
  creator: string;
  category: string;
  icon: React.ReactNode;
  gradient: string;
};

interface ZappCardProps {
  project: ZappProject;
}

const truncateAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export function ZappCard({ project }: ZappCardProps) {
  const router = useRouter();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/apps/${project.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/apps/${project.id}`);
      }}
    >
      <div
        className={`relative rounded-lg bg-gradient-to-br ${project.gradient} flex h-[140px] flex-col justify-between overflow-hidden p-4 transition-all duration-300 hover:scale-[1.02]`}
      >
        {/* Category with Icon */}
        <div className="mb-3 flex items-center gap-1.5">
          <div className="rounded-full bg-white/20 p-1 backdrop-blur-sm">
            {project.icon}
          </div>
          <span className="text-xs font-medium">{project.category}</span>
        </div>
        {/* Project Name */}
        <h3 className="font-heading text-lg font-bold">{project.title}</h3>
        {/* Creator Address */}
        <div className="mt-auto flex items-center justify-between">
          <div className="font-mono text-xs opacity-80">
            {truncateAddress(project.creator)}
          </div>
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 bg-white/10 px-2 py-0 text-xs hover:bg-white/20"
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export icons for use in featuredProjects
export const ZappIcons = {
  Wallet,
  ImageIcon,
  BarChart3,
  Zap,
  Users,
  Boxes,
  Layout,
  Globe,
};
