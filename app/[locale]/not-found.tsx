"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileX } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          {/* 404 icon */}
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileX className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="text-6xl font-bold text-muted-foreground mb-2">
              {t("error404")}
            </div>
          </div>

          {/* Title and description */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              {t("title")}
            </h1>
            <p className="text-muted-foreground mb-2">{t("description")}</p>
            <p className="text-sm text-muted-foreground">{t("message")}</p>
          </div>

          {/* Button group */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("goBack")}
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                {t("goHome")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
