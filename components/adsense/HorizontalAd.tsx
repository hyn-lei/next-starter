"use client";

import AdSenseAd from "./AdSenseAd";

export interface HorizontalAdProps {
  /** Advertisement position identifier */
  position:
    | "hero-bottom"
    | "between-options"
    | "features-bottom"
    | "how-to-bottom"
    | "faq-bottom"
    | "share-options-bottom";
  /** Custom CSS class name */
  className?: string;
}

const HorizontalAd: React.FC<HorizontalAdProps> = ({
  position,
  className = "",
}) => {
  // Return corresponding ad slot ID based on position (you need to get these IDs from AdSense dashboard)
  const getAdSlotId = (pos: string): string | undefined => {
    const adSlots: Record<string, string> = {
      "hero-bottom": "slot11", // Horizontal ad below hero section
      "between-options": "slot12", // Horizontal ad between export options
      "features-bottom": "slot13", // Horizontal ad below features section
      "how-to-bottom": "slot14", // Horizontal ad below how-to section
      "faq-bottom": "slot15", // Horizontal ad below FAQ section
      "share-options-bottom": "slot16", // Ad at bottom of share options
    };

    return adSlots[pos];
  };

  // Set different styles based on position
  const getPositionStyles = (pos: string): string => {
    const styles: Record<string, string> = {
      "hero-bottom": "my-8 py-4",
      "between-options": "my-6 py-3",
      "features-bottom": "my-8 py-4",
      "how-to-bottom": "my-8 py-4",
      "faq-bottom": "my-8 py-4",
      "share-options-bottom": "my-6 py-3",
    };

    return styles[pos] || "my-6";
  };

  const slot = getAdSlotId(position);
  if (!slot) return null; // Don't render if not configured, avoid invalid requests

  return (
    <div
      className={`horizontal-ad-container ${getPositionStyles(
        position,
      )} ${className}`}
    >
      <AdSenseAd
        adType="responsive"
        adSlot={slot}
        position={`horizontal-${position}`}
        className="mx-auto"
        hideDebugLabel={true}
      />
    </div>
  );
};

export default HorizontalAd;
