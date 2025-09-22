import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container py-8 md:py-4 mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
          >
            <Image
              src="/next.svg"
              alt="Markdown to image Logo"
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <span className="font-semibold text-lg">SaaS Serivce</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("contact")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("terms")}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">© {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
