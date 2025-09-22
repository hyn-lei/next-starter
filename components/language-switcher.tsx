"use client";

import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Language {
  locale: string;
  name: string;
  flag: string;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  const languages: Language[] = [
    { locale: "en", name: "English", flag: "🇺🇸" },
    { locale: "zh", name: "中文", flag: "🇨🇳" },
    { locale: "de", name: "Deutsch", flag: "🇩🇪" },
    { locale: "es", name: "Español", flag: "🇪🇸" },
    { locale: "pt", name: "Português", flag: "🇵🇹" },
    { locale: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.locale === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title={t("selectLanguage")}
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("selectLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.locale}
            onClick={() => handleLanguageChange(language.locale)}
            className={locale === language.locale ? "bg-accent" : ""}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
