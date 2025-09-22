import { useEffect, useState, useCallback } from "react";

// Simplified font class mapping - using dynamic CSS classes
const fontClassMapping = {
  "font-noto-serif": "font-dynamic-noto-serif",
  "font-roboto": "font-dynamic-roboto",
  "font-roboto-mono": "font-dynamic-roboto-mono",
  "font-jetbrains": "font-dynamic-jetbrains",
  "font-source-code": "font-dynamic-source-code",
  "font-lora": "font-dynamic-lora",
  "font-playfair": "font-dynamic-playfair",
  "font-ubuntu": "font-dynamic-ubuntu",
  "font-ubuntu-mono": "font-dynamic-ubuntu-mono",
  "font-work-sans": "font-dynamic-work-sans",
  "font-montserrat": "font-dynamic-montserrat",
  "font-merriweather": "font-dynamic-merriweather",
  "font-source-sans": "font-dynamic-source-sans",
  "font-open-sans": "font-dynamic-open-sans",
  "font-noto-sans-jp": "font-dynamic-noto-sans-jp",
  "font-noto-naskh-arabic": "font-dynamic-noto-naskh-arabic",
  // Additional Google fonts
  "font-noto-sans-cyrillic": "font-dynamic-noto-sans-cyrillic",
  "font-anek-latin": "font-dynamic-anek-latin",
  // Move previously preloaded fonts to dynamic loading
  "font-noto-sans": "font-dynamic-noto-sans",
  "font-noto-sans-sc": "font-dynamic-noto-sans-sc",
  "font-noto-sans-tc": "font-dynamic-noto-sans-tc",
  "font-fira-code": "font-dynamic-fira-code",
  // Local system fonts
  "font-times-new-roman": "font-local-times-new-roman",
  "font-microsoft-yahei": "font-local-microsoft-yahei",
  "font-pingfang-sc": "font-local-pingfang-sc",
  "font-hiragino-sans-gb": "font-local-hiragino-sans-gb",
  "font-arial": "font-local-arial",
  "font-georgia": "font-local-georgia",
  "font-verdana": "font-local-verdana",
} as const;

// CSS loading function for web fonts
const loadWebFont = (
  fontFamily: string,
  fontWeight: string = "400",
  subset: string = "latin",
) => {
  const link = document.createElement("link");
  const subsetParam = subset === "latin" ? "" : `&subset=${subset}`;
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@${fontWeight}&display=swap${subsetParam}`;
  link.rel = "stylesheet";

  // Avoid duplicate loading
  const existingLink = document.querySelector(`link[href="${link.href}"]`);
  if (!existingLink) {
    document.head.appendChild(link);
  }
};

// Font to Google Fonts name mapping
const fontToGoogleFonts = {
  "font-noto-serif": "Noto+Serif",
  "font-roboto": "Roboto",
  "font-roboto-mono": "Roboto+Mono",
  "font-jetbrains": "JetBrains+Mono",
  "font-source-code": "Source+Code+Pro",
  "font-lora": "Lora",
  "font-playfair": "Playfair+Display",
  "font-ubuntu": "Ubuntu",
  "font-ubuntu-mono": "Ubuntu+Mono",
  "font-work-sans": "Work+Sans",
  "font-montserrat": "Montserrat",
  "font-merriweather": "Merriweather",
  "font-source-sans": "Source+Sans+3",
  "font-open-sans": "Open+Sans",
  "font-noto-sans-jp": "Noto+Sans+JP",
  "font-noto-naskh-arabic": "Noto+Naskh+Arabic",
  // Move originally preloaded fonts to on-demand loading too
  "font-noto-sans": "Noto+Sans",
  "font-noto-sans-sc": "Noto+Sans+SC",
  "font-noto-sans-tc": "Noto+Sans+TC",
  "font-fira-code": "Fira+Code",
  // Additional Google fonts
  "font-noto-sans-cyrillic": "Noto+Sans",
  "font-anek-latin": "Anek+Latin",
} as const;

// Local system font list - these fonts don't need to be loaded from Google
const localFonts = new Set([
  "font-times-new-roman",
  "font-microsoft-yahei",
  "font-pingfang-sc",
  "font-hiragino-sans-gb",
  "font-arial",
  "font-georgia",
  "font-verdana",
]);

// Global font loading status cache
const loadedWebFonts = new Set<string>();

export function useDynamicFont(fontOption?: {
  base: string;
  heading: string;
  mono: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const getFontClass = useCallback((originalClass: string) => {
    // Only keep Inter and basic fonts as preloaded, all others changed to on-demand loading
    if (
      originalClass === "font-inter" ||
      originalClass === "font-sans" ||
      originalClass === "font-serif" ||
      originalClass === "font-mono"
    ) {
      return originalClass;
    }

    // If it's a local system font, directly return mapped class name without loading
    if (localFonts.has(originalClass)) {
      return (
        fontClassMapping[originalClass as keyof typeof fontClassMapping] ||
        "font-sans"
      );
    }

    // For Google fonts, load web font first then return mapped class name
    if (fontToGoogleFonts[originalClass as keyof typeof fontToGoogleFonts]) {
      const googleFontName =
        fontToGoogleFonts[originalClass as keyof typeof fontToGoogleFonts];

      // Asynchronously load web font
      if (!loadedWebFonts.has(originalClass)) {
        // Special handling for Cyrillic font subset
        if (originalClass === "font-noto-sans-cyrillic") {
          loadWebFont(googleFontName.replace("+", " "), "400;700", "cyrillic");
        } else {
          loadWebFont(googleFontName, "400;700");
        }
        loadedWebFonts.add(originalClass);
      }
    }

    // Return mapped CSS class name or fallback to default
    return (
      fontClassMapping[originalClass as keyof typeof fontClassMapping] ||
      "font-sans"
    );
  }, []);

  useEffect(() => {
    if (!fontOption) return;

    setIsLoading(true);

    // Preload web fonts for selected fonts
    const fontsToLoad = [fontOption.base, fontOption.heading, fontOption.mono];
    const uniqueFonts = [...new Set(fontsToLoad)];

    uniqueFonts.forEach((font) => {
      // Skip local fonts and basic fonts
      if (
        localFonts.has(font) ||
        font === "font-inter" ||
        font === "font-sans" ||
        font === "font-serif" ||
        font === "font-mono"
      ) {
        return;
      }

      // Load Google fonts
      if (
        fontToGoogleFonts[font as keyof typeof fontToGoogleFonts] &&
        !loadedWebFonts.has(font)
      ) {
        const googleFontName =
          fontToGoogleFonts[font as keyof typeof fontToGoogleFonts];

        // Special handling for Cyrillic font subset
        if (font === "font-noto-sans-cyrillic") {
          loadWebFont(googleFontName.replace("+", " "), "400;700", "cyrillic");
        } else {
          loadWebFont(googleFontName, "400;700");
        }
        loadedWebFonts.add(font);
      }
    });

    // Give some time for fonts to start loading
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [fontOption]);

  return {
    isLoading,
    getFontClass,
  };
}
