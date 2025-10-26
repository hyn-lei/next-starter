"use client";

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown, { Components } from "react-markdown";
// import 'highlight.js/styles/nord.css';
import rehypeHighlight from "rehype-highlight";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// import 'katex/dist/katex.min.css';
import "./katex-custom.css";

// @ts-ignore
import rehypeMathjax from "rehype-mathjax";
import { useCallback, useEffect, useMemo, useState } from "react";
import remarkBreaks from "remark-breaks";
import { useHighlightStyle } from "@/hooks/useHighlightStyle";

import type { ElementContent } from "hast";

let mermaid: any = null;
const loadMermaid = async () => {
  if (!mermaid) {
    const mermaidModule = await import("mermaid");
    mermaid = mermaidModule.default;
  }
  return mermaid;
};

const components2: Components = {
  table: ({ node, ...props }) => {
    return (
      <table
        {...props}
        // style={{ overflowWrap: 'anywhere' }}
        className={`table-auto border-collapse border rounded w-full overflow-wrap`}
      />
    );
  },
  thead: ({ node, ...props }) => {
    return <thead {...props} className={`border `} />;
  },
  th: ({ node, ...props }) => {
    return (
      <th
        {...props}
        className={`border p-2 ${node?.position?.start.column == 1 && ""}`}
      />
    );
  },
  td: ({ node, ...props }) => {
    return (
      <td
        {...props}
        className={` border p-2 whitespace-normal ${
          node?.position?.start.column == 1 && ""
        }`}
      />
    );
  },
  pre: (props) => {
    const { node, ...restProps } = props;

    const first = (node as any)?.children?.[0] as ElementContent | undefined;

    if (first?.type === "element" && first.tagName === "code") {
      return <pre className="p-0" {...restProps} />;
    }
    return <pre {...restProps} className={``} />;
  },
  code: (props) => {
    if (props.className && props.className.indexOf("mermaid") > 0) {
      return (
        <div className={"mermaid flex justify-center"}>{props.children}</div>
      );
    }
    return (
      <>
        <code className={props.className}>{props.children}</code>
      </>
    );
  },
};

// 将 Tailwind CSS 类名映射为实际字体
const fontClassMap: Record<string, string> = {
  "font-sans":
    '-apple-system,BlinkMacSystemFont,Segoe UI,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  "font-serif": 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "font-mono":
    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  "font-noto-serif":
    '"Noto Serif", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "font-fira-code":
    '"Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  "font-roboto": '"Roboto", ui-sans-serif, system-ui, sans-serif',
  "font-roboto-mono":
    '"Roboto Mono", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  "font-inter": '"Inter", ui-sans-serif, system-ui, sans-serif',
  "font-jetbrains":
    '"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  "font-source-code":
    '"Source Code Pro", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  "font-lora":
    '"Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "font-playfair":
    '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "font-ibm-plex": '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  "font-ubuntu": '"Ubuntu", ui-sans-serif, system-ui, sans-serif',
  "font-ubuntu-mono":
    '"Ubuntu Mono", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  "font-work-sans": '"Work Sans", ui-sans-serif, system-ui, sans-serif',
  "font-montserrat": '"Montserrat", ui-sans-serif, system-ui, sans-serif',
  "font-merriweather":
    '"Merriweather", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "font-source-sans": '"Source Sans Pro", ui-sans-serif, system-ui, sans-serif',
  "font-open-sans": '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  "font-microsoft-yahei":
    '"Microsoft YaHei", "微软雅黑", ui-sans-serif, system-ui, sans-serif',
  "font-pingfang-sc":
    '"PingFang SC", "苹方", ui-sans-serif, system-ui, sans-serif',
  "font-noto-sans-jp": '"Noto Sans JP", ui-sans-serif, system-ui, sans-serif',
  "font-noto-sans-tc":
    '"Noto Sans CJK TC", ui-sans-serif, system-ui, sans-serif',
  "font-noto-sans-sc":
    '"Noto Sans CJK SC", ui-sans-serif, system-ui, sans-serif',
  "font-times-new-roman":
    '"Times New Roman", ui-serif, Georgia, Cambria, Times, serif',
  "font-noto-naskh-arabic":
    '"Noto Naskh Arabic", ui-sans-serif, system-ui, sans-serif',
  "font-noto-sans-cyrillic":
    '"Noto Sans", ui-sans-serif, system-ui, sans-serif',
  "font-anek-latin": '"Anek Latin", ui-sans-serif, system-ui, sans-serif',
};

export default function MdxRender({
  markdownText,
  components,
  selectedFont,
  codeStyle = "nord",
}: any) {
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  useHighlightStyle(codeStyle);

  const getFontFamily = (selectedFont: any) => {
    if (!selectedFont) return "ui-sans-serif, system-ui, sans-serif";

    if (selectedFont.value) return selectedFont.value;

    const fontClass = selectedFont.base || selectedFont;
    return fontClassMap[fontClass] || "ui-sans-serif, system-ui, sans-serif";
  };

  const fontFamily = getFontFamily(selectedFont);

  const initMermaid = useCallback(async () => {
    try {
      const mermaidInstance = await loadMermaid();

      mermaidInstance.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "default",
        themeVariables: {
          fontFamily: fontFamily,
        },
        flowchart: {
          htmlLabels: true,
          useMaxWidth: true,
        },
        sequence: {
          useMaxWidth: true,
        },
        gantt: {
          useMaxWidth: true,
        },
      });

      setMermaidLoaded(true);
      return mermaidInstance;
    } catch (error) {
      console.error("Failed to load Mermaid:", error);
      return null;
    }
  }, [fontFamily]);

  useEffect(() => {
    if (!markdownText) return;

    const hasMermaid = markdownText.includes("```mermaid");
    if (!hasMermaid) return;

    const timer = setTimeout(async () => {
      const mermaidInstance = await initMermaid();
      if (!mermaidInstance) return;

      let maids = document.querySelectorAll(".mermaid");
      maids.forEach(async (me, index) => {
        if (me.hasAttribute("data-processed")) {
          me.removeAttribute("data-processed");
          const originalText =
            me.getAttribute("data-original-text") || me.textContent?.trim();
          if (originalText) {
            me.textContent = originalText;
            me.innerHTML = originalText;
          }
        }

        // Check if there is already a rendered SVG, if so, don't rerender
        if (!me.textContent || me.textContent.includes("#mermaid-")) return;
        if (!me.querySelector("svg") && !me.hasAttribute("data-processed")) {
          const originalContent = me.textContent.trim();
          me.setAttribute("data-original-text", originalContent);
          me.setAttribute("data-processed", "true");

          try {
            const result = await mermaidInstance.render(
              "maid" + index + "_" + Date.now(),
              originalContent
            );
            // setError && setError(null);
            me.innerHTML = result.svg;
          } catch (originalError: any) {
            console.log(
              "Original Mermaid content rendering failed:",
              originalError
            );

            if (originalError.message.includes("No diagram type detected")) {
              return;
            }
          }
        }
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [markdownText, selectedFont, initMermaid]);

  const ReactMarkdownMemo = useMemo(() => {
    const mergedComponents = components
      ? { ...components2, ...components }
      : components2;

    return (
      <ReactMarkdown
        remarkPlugins={[
          remarkMath,
          remarkGfm,
          // remarkBreaks,
        ]}
        rehypePlugins={[
          rehypeRaw,
          rehypeUnwrapImages,
          // @ts-ignore
          // [rehypeMathjax],
          [
            rehypeKatex,
            {
              trust: true,
              output: "html",
              strict: false,
              extensions: ["amsmath", "amsfonts", "amssymb"],
              macros: {
                "\\Bbb": "\\mathbb",
              },
              fleqn: false,
              displayMode: false,
            },
          ],
          // @ts-ignore
          [rehypeHighlight, { ignoreMissing: true }],
        ]}
        components={mergedComponents}
      >
        {markdownText}
      </ReactMarkdown>
    );
  }, [markdownText, components]);
  return <>{ReactMarkdownMemo}</>;
}
