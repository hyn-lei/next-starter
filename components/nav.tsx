"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Database,
  FileEdit,
  BarChart3,
  Users,
  Table,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme/theme-toggle";
import UserNav from "./user-nav";
import { I18nLink } from "./i18n-link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navigation");

  const toolsNavigation = [
    {
      name: t("tool1"),
      href: "/tool1",
      icon: Database,
      description: t("tool1Desc"),
    },
    {
      name: t("tool2"),
      href: "/tool2",
      icon: FileEdit,
      description: t("tool2Desc"),
    },
    {
      name: t("tool3"),
      href: "/tool3",
      icon: BarChart3,
      description: t("tool3Desc"),
    },
    {
      name: t("tool4"),
      href: "/tool4",
      icon: Users,
      description: t("tool4Desc"),
    },
  ];

  const mainNavigation = [
    { name: t("home"), href: "/" },
    { name: t("showcase"), href: "/showcase" },
    { name: t("explore"), href: "/explore" },
    { name: t("blog"), href: "/blog" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xs border-b border-border/40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <I18nLink
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex items-center"
            >
              <Image
                src="/next.svg"
                className="mr-3 h-6 sm:h-9"
                width={36}
                height={36}
                alt="Markdown to image Logo"
              />
              SaaS Serivce
            </I18nLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Main navigation items */}
                {mainNavigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <I18nLink
                        href={item.href}
                        className="text-xs xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-accent"
                      >
                        {item.name}
                      </I18nLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* Tools dropdown menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs xl:text-sm font-medium">
                    {t("tools")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                      {toolsNavigation.map((tool) => (
                        <NavigationMenuLink asChild key={tool.href}>
                          <I18nLink
                            href={tool.href}
                            className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center space-x-2">
                              <tool.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">
                                {tool.name}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-accent-foreground">
                              {tool.description}
                            </p>
                          </I18nLink>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              asChild
              size="sm"
              className="text-xs xl:text-sm whitespace-nowrap"
            >
              <I18nLink href="/tool1">{t("startConverting")}</I18nLink>
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            <UserNav />
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden",
            "transition-all duration-300 ease-in-out",
            isOpen
              ? "h-[calc(100vh-4rem)] opacity-100"
              : "h-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="flex flex-col space-y-4 py-6">
            {/* Main navigation */}
            {mainNavigation.map((item) => (
              <I18nLink
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-accent"
              >
                {item.name}
              </I18nLink>
            ))}

            {/* Tools category */}
            <div className="pt-2">
              <h3 className="px-2 mb-2 text-sm font-semibold text-foreground">
                {t("tools")}
              </h3>
              {toolsNavigation.map((tool) => (
                <I18nLink
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md hover:bg-accent"
                >
                  <tool.icon className="h-4 w-4" />
                  <span>{tool.name}</span>
                </I18nLink>
              ))}
            </div>

            <div className="pt-4 border-t border-border/40">
              <Button
                className="w-full justify-center"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <I18nLink href="/tool1">{t("startConverting")}</I18nLink>
              </Button>
            </div>
            <UserNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
