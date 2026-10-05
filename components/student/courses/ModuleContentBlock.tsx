import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  Link2,
} from "lucide-react";

import type { ModuleContentBlock as Block } from "@/types/student-module";

const textClass =
  "whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200";

const callouts = {
  FUN_FACT: {
    label: "Fun Fact",
    icon: Lightbulb,
    box: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
    iconColor: "text-amber-500",
  },
  GOOD_TO_KNOW: {
    label: "Good to Know",
    icon: Info,
    box: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
    iconColor: "text-blue-500",
  },
  COMMON_MISTAKE: {
    label: "Common Mistake",
    icon: AlertTriangle,
    box: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40",
    iconColor: "text-red-500",
  },
} as const;

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    let id: string | null = null;

    if (parsed.hostname === "youtu.be") {
      id = parsed.pathname.slice(1);
    } else if (parsed.hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v");
      } else if (
        parsed.pathname.startsWith("/embed/") ||
        parsed.pathname.startsWith("/shorts/")
      ) {
        id = parsed.pathname.split("/")[2];
      }
    }

    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function Unavailable() {
  return (
    <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      This content is not available.
    </p>
  );
}

export default function ModuleContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "TEXT":
      return block.content ? <p className={textClass}>{block.content}</p> : null;

    case "VIDEO":
      if (!block.url) return <Unavailable />;

      return (
        <div>
          <video
            controls
            preload="metadata"
            src={block.url}
            className="w-full rounded-xl bg-black"
          />

          {block.content && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {block.content}
            </p>
          )}
        </div>
      );

    case "YOUTUBE": {
      if (!block.url) return <Unavailable />;

      const embedUrl = getYouTubeEmbedUrl(block.url);

      if (!embedUrl) {
        return (
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            <ExternalLink size={16} />
            Watch on YouTube
          </a>
        );
      }

      return (
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    }

    case "PDF":
      if (!block.url) return <Unavailable />;

      return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
            <FileText size={22} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-white">
              PDF document
            </p>

            {block.content && (
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {block.content}
              </p>
            )}
          </div>

          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Open PDF
          </a>
        </div>
      );

    case "ARTICLE":
      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <Link2 size={18} />
            </span>

            <div className="min-w-0 flex-1">
              {block.content && <p className={textClass}>{block.content}</p>}

              {block.url && (
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Read article
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      );

    case "IMAGE":
      if (!block.url) return <Unavailable />;

      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.content || ""}
            className="max-h-[520px] w-full rounded-xl object-contain"
          />

          {block.content && (
            <figcaption className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {block.content}
            </figcaption>
          )}
        </figure>
      );

    case "FUN_FACT":
    case "GOOD_TO_KNOW":
    case "COMMON_MISTAKE": {
      const callout = callouts[block.type];
      const Icon = callout.icon;

      return (
        <div className={`rounded-xl border p-4 ${callout.box}`}>
          <p className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Icon size={18} className={callout.iconColor} />
            {callout.label}
          </p>

          {block.content && <p className={textClass}>{block.content}</p>}
        </div>
      );
    }

    default:
      return null;
  }
}
