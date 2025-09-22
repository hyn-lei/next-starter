"use client";
import { useTranslations } from "next-intl";
import { I18nLink } from "@/components/i18n-link";
import { LogOut, User, Image, ShieldCheck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

export function Sidebar() {
  const t = useTranslations("userNav");
  const profileT = useTranslations("Profile");
  const creditsT = useTranslations("credits");
  const pathname = usePathname();

  const navItems = [
    {
      title: t("profile"),
      href: "/profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    {
      title: creditsT("title"),
      href: "/profile/credits",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="rounded-lg border border-border/40 p-4 bg-card">
      <div className="pb-4 border-b mb-4 border-border/40">
        <h2 className="text-xl font-semibold">{t("profile")}</h2>
        <p className="text-sm text-muted-foreground">{t("manageAccount")}</p>
      </div>

      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <I18nLink
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2.5 text-sm rounded-md transition-all",
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-accent hover:text-foreground",
            )}
          >
            {item.icon}
            {item.title}
          </I18nLink>
        ))}

        <div className="border-t border-border/30 my-2 pt-2"></div>

        <SignOutButton>
          <button className="flex w-full items-center px-3 py-2.5 text-sm rounded-md text-left transition-all text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut className="h-4 w-4 mr-2" />
            {t("signOut")}
          </button>
        </SignOutButton>
      </nav>
    </div>
  );
}
