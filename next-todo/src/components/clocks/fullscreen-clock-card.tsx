"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

type RenderContext = {
  isFullscreen: boolean;
};

type FullscreenClockCardProps = {
  title?: string;
  baseClassName: string;
  fullscreenClassName?: string;
  titleClassName?: string;
  fullscreenTitleClassName?: string;
  buttonClassName?: string;
  children: (ctx: RenderContext) => ReactNode;
  footer?: (ctx: RenderContext) => ReactNode;
};

const DEFAULT_BUTTON_CLASSES =
  "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs font-semibold text-white/80 backdrop-blur-sm transition hover:border-white/60 hover:bg-black/50";

export const FullscreenClockCard = ({
  title = "Time Elapsed",
  baseClassName,
  fullscreenClassName,
  titleClassName,
  fullscreenTitleClassName,
  buttonClassName = DEFAULT_BUTTON_CLASSES,
  children,
  footer,
}: FullscreenClockCardProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const updateState = useCallback(() => {
    const element = wrapperRef.current;
    const fsDoc = document as FullscreenDocument;
    const fullscreenElement =
      fsDoc.fullscreenElement ??
      fsDoc.webkitFullscreenElement ??
      fsDoc.mozFullScreenElement ??
      fsDoc.msFullscreenElement;
    setIsFullscreen(Boolean(element && fullscreenElement === element));
  }, []);

  useEffect(() => {
    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    events.forEach((event) => document.addEventListener(event, updateState));
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, updateState)
      );
    };
  }, [updateState]);

  const handleToggle = () => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }
    if (isFullscreen) {
      const exitFullscreen =
        document.exitFullscreen ||
        (document as FullscreenDocument).webkitExitFullscreen ||
        (document as FullscreenDocument).mozCancelFullScreen ||
        (document as FullscreenDocument).msExitFullscreen;
      if (typeof exitFullscreen === "function") {
        exitFullscreen.call(document);
      }
      return;
    }
    const target = element as FullscreenElement;
    const requestFullscreen =
      element.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.mozRequestFullScreen ||
      target.msRequestFullscreen;
    if (typeof requestFullscreen === "function") {
      requestFullscreen.call(element);
    }
  };

  const wrapperClasses = useMemo(() => {
    const fullscreenClasses =
      fullscreenClassName ??
      "flex min-h-screen w-full flex-col items-center justify-center gap-6 border bg-slate-900 p-8 text-center shadow-none";
    return [
      "relative",
      isFullscreen ? fullscreenClasses : baseClassName,
    ].join(" ");
  }, [baseClassName, fullscreenClassName, isFullscreen]);

  const headingClasses = useMemo(() => {
    const base =
      titleClassName ??
      "text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-600";
    const fullscreen =
      fullscreenTitleClassName ??
      "text-center text-sm font-bold uppercase tracking-[0.45em] text-white";
    return isFullscreen ? fullscreen : base;
  }, [fullscreenTitleClassName, isFullscreen, titleClassName]);

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      <button
        type="button"
        onClick={handleToggle}
        className={buttonClassName}
        aria-label={isFullscreen ? "Exit fullscreen" : "View clock fullscreen"}
      >
        {isFullscreen ? "✕" : "⛶"}
      </button>
      {title && <p className={`mb-4 ${headingClasses}`}>{title}</p>}
      <div className="w-full">{children({ isFullscreen })}</div>
      {footer && <div>{footer({ isFullscreen })}</div>}
    </div>
  );
};


