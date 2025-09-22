import { I18nLink } from "@/components/i18n-link";
import "./globals.css";

export default function LocaleNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="w-full max-w-md text-center bg-card border border-border rounded-lg p-8">
            {/* 404 icon */}
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <div className="text-6xl font-bold text-muted-foreground mb-2">
                404
              </div>
            </div>

            {/* Title and description */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Page Not Found
              </h1>
              <p className="text-muted-foreground mb-2">
                Sorry, the page you are looking for does not exist.
              </p>
              <p className="text-sm text-muted-foreground">
                The page you visited may have been moved, deleted, or you
                entered the wrong address.
              </p>
            </div>

            {/* Button group */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <I18nLink
                href="/"
                className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                🏠 Go Home
              </I18nLink>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
