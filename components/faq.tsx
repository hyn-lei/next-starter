import { getTranslations } from "next-intl/server";
import { HelpCircle } from "lucide-react";

export default async function Faq() {
  const t = await getTranslations("faq");

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shadow-lg shadow-primary/20">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("description")}</p>
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Regular FAQ items */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border bg-card/50 hover:bg-card/80 transition-colors rounded-lg p-5 space-y-3"
          >
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-medium text-sm shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="space-y-3 w-full">
                <h3 className="font-medium text-base">
                  {t(`items.${index}.q`)}
                </h3>
                <div className="text-muted-foreground text-sm">
                  {t(`items.${index}.a`)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
