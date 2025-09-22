import { Card } from "@/components/ui/card";
import { Shield, Globe, Palette, Monitor, Zap, Users } from "lucide-react";
import { cloneElement, type JSX } from "react";
import { getTranslations } from "next-intl/server";

interface FeatureItem {
  key: string;
  icon: JSX.Element;
}

const features: FeatureItem[] = [
  {
    key: "userAuth",
    icon: <Users className="w-6 h-6" />,
  },
  {
    key: "multiLanguage",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    key: "themeSwitch",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    key: "responsive",
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    key: "security",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    key: "performance",
    icon: <Zap className="w-6 h-6" />,
  },
];

export default async function FeatureList() {
  const t = await getTranslations("features");
  const tList = await getTranslations("features.list");

  return (
    <section className="container py-16 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 transition-colors hover:bg-muted/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {cloneElement(feature.icon, {
                className: "h-6 w-6 text-primary",
              })}
            </div>
            <h3 className="font-semibold tracking-tight mb-2">
              {tList(`${feature.key}.title`)}
            </h3>
            <span className="text-sm text-muted-foreground leading-relaxed">
              {tList(`${feature.key}.description`)}
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
