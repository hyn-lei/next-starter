"use client";

import { useEffect, useState } from "react";
import AdSenseAd from "./AdSenseAd";

export interface AdSenseLayoutProps {
  /** Children for content area */
  children: React.ReactNode;
  /** Whether to show sidebar ads (>1440px) */
  showSidebarAds?: boolean;
  /** Left ad unit ID */
  leftAdSlot?: string;
  /** Right ad unit ID */
  rightAdSlot?: string;
}

const AdSenseLayout: React.FC<AdSenseLayoutProps> = ({
  children,
  showSidebarAds = true,
  leftAdSlot = "slot1", // Replace with your actual ad slot ID
  rightAdSlot = "slot2", // Replace with your actual ad slot ID
}) => {
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth > 1440);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="relative w-full">
      {/* Large screen sidebar ads */}
      {showSidebarAds && isWideScreen && (
        <>
          {/* Left sidebar ad */}
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10">
            <AdSenseAd
              adType="responsive"
              adSlot={leftAdSlot}
              position="sidebar-left"
              className=""
              hideDebugLabel={true}
            />
          </div>

          {/* Right sidebar ad */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10">
            <AdSenseAd
              adType="responsive"
              adSlot={rightAdSlot}
              position="sidebar-right"
              className=""
              hideDebugLabel={true}
            />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className={isWideScreen ? "" : "w-full"}>{children}</div>
    </div>
  );
};

export default AdSenseLayout;
