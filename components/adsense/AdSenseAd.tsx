"use client";

import { useEffect, useRef } from "react";

export interface AdSenseAdProps {
  /** Ad unit type */
  adType: "horizontal" | "vertical" | "square" | "responsive" | "in-article";
  /** Ad unit ID (ad unit ID created in AdSense dashboard) */
  adSlot: string;
  /** CSS class name */
  className?: string;
  /** Ad position description for debugging */
  position?: string;
  /** Whether to hide debug label */
  hideDebugLabel?: boolean;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adType,
  adSlot,
  className = "",
  position = "unknown",
  hideDebugLabel = false,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (isLoadedRef.current) return;

    const loadAd = () => {
      try {
        if (typeof window === "undefined") return;
        if (!adRef.current) return;

        const containerWidth = adRef.current.getBoundingClientRect().width;
        if (containerWidth < 100) {
          setTimeout(loadAd, 500);
          return;
        }

        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        isLoadedRef.current = true;
      } catch (error) {
        console.error(`Failed to load AdSense ad at ${position}:`, error);
      }
    };

    // Use IntersectionObserver to load when visible, improving viewability
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && adRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.5 &&
            !isLoadedRef.current
          ) {
            loadAd();
            observer && observer.disconnect();
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      observer.observe(adRef.current);
    } else {
      // Fallback: lazy loading
      const timer = setTimeout(loadAd, 600);
      return () => clearTimeout(timer);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [position, adSlot, adType]);

  // Set styles based on ad type
  const getAdStyles = () => {
    switch (adType) {
      case "horizontal":
        return {
          width: "100%",
          // height: '90px',
          display: "block",
        };
      case "vertical":
        return {
          // width: '160px',
          // height: '600px',
          display: "block",
        };
      case "square":
        return {
          // width: '300px',
          // height: '250px',
          display: "block",
        };
      case "responsive":
      default:
        return {
          // width: '100%',
          // height: 'auto',
          display: "block",
        };
    }
  };

  const adStyles = getAdStyles();

  return (
    <div
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        textAlign: "center",
        margin: "20px 0",
        minWidth: "300px", // Ensure minimum width
        minHeight:
          adType === "vertical" ? 250 : adType === "in-article" ? 200 : 120, // Reserve height to reduce CLS
        width: "100%",
        ...adStyles,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          ...adStyles,
          minWidth: "300px", // Ensure ad element also has minimum width
          minHeight:
            adType === "vertical" ? 250 : adType === "in-article" ? 200 : 120,
          width: "100%",
        }}
        data-ad-client="ca-pub-pubid1"
        data-ad-slot={adSlot}
        data-ad-format={
          adType === "responsive"
            ? "auto"
            : adType === "in-article"
              ? "fluid"
              : undefined
        }
        {...(adType === "in-article" ? { "data-ad-layout": "in-article" } : {})}
        data-full-width-responsive={adType === "responsive" ? "true" : "false"}
      />
      {!hideDebugLabel && (
        <div className="text-xs text-gray-400 mt-1">
          AdSense Ad - {position}
        </div>
      )}
    </div>
  );
};

export default AdSenseAd;
