import React from "react";
import { promises as fs } from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Server component - dynamically load localized Markdown content
export async function LocalizedMarkdownContent({
  contentKey,
  locale,
  className,
}: {
  contentKey: string;
  locale: string;
  className?: string;
}) {
  // Build Markdown file path
  const filePath = path.join(
    process.cwd(),
    "content",
    locale,
    `${contentKey}.md`,
  );

  let markdownContent: string | null = null;

  try {
    markdownContent = await fs.readFile(filePath, "utf8");
  } catch (error) {
    console.error(
      `Error loading markdown content for ${contentKey} in ${locale}:`,
      error,
    );
  }

  if (!markdownContent) {
    return (
      <div className="text-red-500">
        Content not available in this language.
      </div>
    );
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom render components to maintain style consistency
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold tracking-tight mb-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          a: ({ node, href, ...props }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
