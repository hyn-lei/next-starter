import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { host } from "@/data";

export type JsonLdToolType =
  | "markdownToImage"
  | "codeToImage"
  | "mermaidToImage"
  | "tableToPdf"
  | "formulaToImage"
  | "githubReadmeToImage";

export interface JsonLdData {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  name: string;
  description: string;
  inLanguage: string;
  applicationCategory: string;
  operatingSystem: "Any";
  url: string;
  offers: {
    "@type": "Offer";
    price: "0";
    priceCurrency: "USD";
  };
  featureList: string[];
  author: {
    "@type": "Organization";
    name: "MarkdownToImage";
  };
}

/**
 * Hook for generating multilingual JSON-LD structured data
 * @param toolType Tool type
 * @returns JSON-LD structured data and script content
 */
export function useJsonLd(toolType: JsonLdToolType) {
  const locale = useLocale();
  const t = useTranslations("jsonLd");

  const toolData = t.raw(toolType);

  const jsonLdData: JsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolData.name,
    description: toolData.description,
    inLanguage: locale,
    applicationCategory: toolData.applicationCategory,
    operatingSystem: "Any",
    url: `${host}${toolData.url}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: toolData.features,
    author: {
      "@type": "Organization",
      name: "MarkdownToImage",
    },
  };

  /**
   * Get script content for React component dangerouslySetInnerHTML
   */
  const getScriptContent = () => ({
    __html: JSON.stringify(jsonLdData),
  });

  return {
    jsonLdData,
    getScriptContent,
  };
}
