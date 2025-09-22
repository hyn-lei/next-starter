import { useEffect } from "react";

/**
 * Clear all highlight.js styles
 */
const clearAllHighlightStyles = () => {
  // Remove all styles loaded through link tags
  const existingLinks = document.querySelectorAll("link[data-highlight-style]");
  existingLinks.forEach((link) => {
    // console.log(`Removing existing highlight style: ${link.getAttribute('data-highlight-style')}`);
    link.remove();
  });
};

/**
 * Load highlight.js styles via CDN (more reliable)
 * @param styleId - Style ID
 * @returns Promise
 */
const loadHighlightStyleViaCDN = (styleId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // First clear all existing styles
    clearAllHighlightStyles();

    // Create new link tag
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${styleId}.css`;
    link.setAttribute("data-highlight-style", styleId);
    link.setAttribute("data-style-id", styleId);

    // Add success and failure handlers
    link.onload = () => {
      // console.log(`Successfully loaded highlight.js style via CDN: ${styleId}`);
      resolve();
    };

    link.onerror = () => {
      console.error(`Failed to load highlight.js style via CDN: ${styleId}`);
      reject(new Error(`Failed to load style: ${styleId}`));
    };

    // Add to document head
    document.head.appendChild(link);
  });
};

// Store currently loaded style
let currentStyleId: string | null = null;

/**
 * Hook for dynamically loading highlight.js styles using dynamic imports
 * @param styleId - The ID of the highlight.js style to load
 */
export const useHighlightStyle = (styleId: string) => {
  useEffect(() => {
    // If style hasn't changed, no need to reload
    if (currentStyleId === styleId) {
      return;
    }

    // Load new style
    const loadStyle = async () => {
      try {
        await loadHighlightStyleViaCDN(styleId);
        currentStyleId = styleId;
        // console.log(`Successfully switched to highlight.js style: ${styleId}`);
      } catch (error) {
        // console.error(`Failed to load highlight.js style: ${styleId}`, error);
      }
    };

    loadStyle();

    // Cleanup function - clear styles when component unmounts
    return () => {
      // Note: Don't clear styles here as other components might still be using them
      // Style cleanup mainly happens during switching
    };
  }, [styleId]);
};

/**
 * Preload highlight.js style for better performance
 * @param styleId - The style ID to preload
 */
export const preloadHighlightStyle = async (styleId: string) => {
  try {
    await loadHighlightStyleViaCDN(styleId);
  } catch (error) {
    console.error(`Failed to preload highlight.js style: ${styleId}`, error);
  }
};

/**
 * Get the current highlight.js style
 * @returns The current style ID or null if none is loaded
 */
export const getCurrentHighlightStyle = (): string | null => {
  return currentStyleId;
};
