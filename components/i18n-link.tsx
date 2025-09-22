import { useLocale } from "next-intl";
import NextLink from "next/link";
import { ComponentProps, forwardRef } from "react";
import { routing } from "@/i18n/routing";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "locale"> & {
  // Optional locale override, usually not needed
  locale?: string;
};

/**
 * Internationalization link component
 *
 * Automatically handles URLs based on current language:
 * - Default language (English): Uses URLs without prefix, like /convert
 * - Non-default language (Chinese): Uses URLs with prefix, like /zh/convert
 */
export const I18nLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, locale: localeProp, ...rest }, ref) => {
    // Get current language
    const locale = useLocale();

    // Decide whether to add language prefix
    let linkHref = href;

    // If locale override is provided, use it
    const targetLocale = localeProp || locale;

    // Only process when it's not an external link
    if (
      typeof href === "string" &&
      !href.startsWith("http") &&
      !href.startsWith("#")
    ) {
      // If not default language, add prefix
      if (targetLocale !== routing.defaultLocale) {
        // Ensure href starts with /
        const normalizedHref = href.startsWith("/") ? href : `/${href}`;
        linkHref = `/${targetLocale}${normalizedHref}`;
      }
    }

    return <NextLink ref={ref} href={linkHref} {...rest} />;
  },
);

I18nLink.displayName = "I18nLink";
