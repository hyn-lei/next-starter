import { FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HowTo() {
  const t = await getTranslations("howTo");
  const tSteps = await getTranslations("howToSteps");

  const steps = [
    {
      title: tSteps("steps.0.title"),
      icon: tSteps("steps.0.icon"),
      content: tSteps("steps.0.content"),
    },
    {
      title: tSteps("steps.1.title"),
      icon: tSteps("steps.1.icon"),
      content: tSteps("steps.1.content"),
    },
    {
      title: tSteps("steps.2.title"),
      icon: tSteps("steps.2.icon"),
      content: tSteps("steps.2.content"),
    },
    {
      title: tSteps("steps.3.title"),
      icon: tSteps("steps.3.icon"),
      content: tSteps("steps.3.content"),
    },
  ];

  return (
    <section>
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shadow-lg shadow-primary/20">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {tSteps("title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {tSteps("description")}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-2 gap-8 relative">
        {steps.map((step, index) => (
          <div key={index} className="relative flex gap-6 items-start group">
            {/* Connector Line - Only show on mobile */}
            {index !== steps.length - 1 && index % 2 === 0 && (
              <div className="absolute left-[27px] top-[52px] h-[calc(100%_+_32px)] w-px bg-linear-to-b from-primary/20 to-border group-hover:from-primary/40 transition-all duration-300 md:hidden" />
            )}

            <div className="flex gap-6 items-start w-full">
              {/* Step Number with Background */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-300" />
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-card shadow-xs border border-border group-hover:border-primary/20 group-hover:shadow-md transition-all duration-300">
                  <span className="text-primary font-semibold text-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-3 pt-1 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <span
                    className="text-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -m-2" />
                  <p className="text-muted-foreground text-sm leading-relaxed relative">
                    {step.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Call to Action - Full Width on Both Layouts */}
        <div className="flex flex-col items-center gap-4 pt-8 border-t md:col-span-2">
          <p className="text-muted-foreground">{t("readyToTransform")}</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="default"
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 w-full sm:w-auto whitespace-nowrap"
              asChild
            >
              <Link href={"/tool1"} className={`tracking-wider`}>
                {t("startConverting")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="gap-2 w-full sm:w-auto whitespace-nowrap"
            >
              <Link href={"/showcase"} className={`tracking-wider`}>
                {t("viewShowcase")}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
