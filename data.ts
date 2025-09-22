export const host = "https://saas-service.com";
export const SITE_NAME = "SaaS Service";

export const locales = ["en", "zh", "de", "es", "pt", "ja"];
export const defaultLocale = "en";

export interface FAQ_ITEM {
  q: string;
  a: string;
}

export interface FAQ_DATA {
  title: string;
  description: string;
  items: FAQ_ITEM[];
}

export const ColorTemplate = [
  "text-green-500  border-green-400 ",
  "text-blue-500  border-blue-400 ",
  "text-red-500 border-red-400 ",
  "text-pink-500 border-pink-400 ",
  "text-rose-500 border-rose-400 ",
  "text-orange-500 border-orange-400 ",
  "text-stone-500 border-stone-400 ",
  "text-teal-500 border-teal-400 ",
  "text-purple-500 border-purple-400 ",
  "text-violet-500 border-violet-400 ",
  "text-slate-500 border-slate-400 ",
  "text-sky-500 border-sky-400 ",
  "text-indigo-500 border-indigo-400 ",
  "text-cyan-500 border-cyan-400 ",
  "text-lime-500 border-lime-400 ",
  "text-yellow-500 border-yellow-400 ",
  "text-gray-500 border-gray-400 ",
  "text-zinc-500 border-zinc-400 ",
  "text-neutral-500 border-neutral-400 ",
  "text-emerald-500 border-emerald-400 ",
  "text-amber-500 border-amber-400 ",
  "text-fuchsia-500 border-fuchsia-400 " + "lg:grid-cols-3 ",
  "text-sm text-neutral_2 my-4 italic flex flex-wrap gap-1 border-t border-slate-200 pt-4 ",
  "bg-gray-50 bg-white bg-black bg-slate-50 bg-zinc-50 bg-blue-50 bg-green-50 bg-red-50 bg-yellow-50 bg-purple-50 bg-pink-50 bg-orange-50 bg-teal-50 bg-cyan-50 bg-amber-50 bg-neutral-50 bg-stone-50 bg-lime-50 bg-emerald-50 bg-fuchsia-50 ",
  "[&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans ",
  "[&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans ",
  "[&_h2]:font-noto-serif [&_h3]:font-noto-serif [&_h4]:font-noto-serif [&_h5]:font-noto-serif [&_h6]:font-noto-serif ",
  "[&_h2]:font-roboto [&_h3]:font-roboto [&_h4]:font-roboto [&_h5]:font-roboto [&_h6]:font-roboto ",
  "[&_h2]:font-inter [&_h3]:font-inter [&_h4]:font-inter [&_h5]:font-inter [&_h6]:font-inter ",
  "[&_h2]:font-jetbrains [&_h3]:font-jetbrains [&_h4]:font-jetbrains [&_h5]:font-jetbrains [&_h6]:font-jetbrains ",
  "[&_h2]:font-playfair [&_h3]:font-playfair [&_h4]:font-playfair [&_h5]:font-playfair [&_h6]:font-playfair ",
  "[&_h2]:font-ibm-plex [&_h3]:font-ibm-plex [&_h4]:font-ibm-plex [&_h5]:font-ibm-plex [&_h6]:font-ibm-plex ",
  "[&_h2]:font-ubuntu [&_h3]:font-ubuntu [&_h4]:font-ubuntu [&_h5]:font-ubuntu [&_h6]:font-ubuntu ",
  "[&_h2]:font-montserrat [&_h3]:font-montserrat [&_h4]:font-montserrat [&_h5]:font-montserrat [&_h6]:font-montserrat ",
  "[&_h2]:font-source-sans [&_h3]:font-source-sans [&_h4]:font-source-sans [&_h5]:font-source-sans [&_h6]:font-source-sans ",
  "[&_h2]:font-open-sans [&_h3]:font-open-sans [&_h4]:font-open-sans [&_h5]:font-open-sans [&_h6]:font-open-sans ",
  "[&_pre]:font-mono [&_code]:font-mono ",
  "[&_pre]:font-fira-code [&_code]:font-fira-code",
  "[&_pre]:font-jetbrains [&_code]:font-jetbrains",
  "[&_pre]:font-source-code [&_code]:font-source-code",
  "[&_pre]:font-playfair [&_code]:font-playfair",
  "[&_pre]:font-ibm-plex [&_code]:font-ibm-plex",
  "[&_pre]:font-ubuntu-mono [&_code]:font-ubuntu-mono",
  "[&_pre]:font-open-sans [&_code]:font-open-sans",
  "[&_pre]:font-merriweather [&_code]:font-merriweather",
  "[&_pre]:font-work-sans [&_code]:font-work-sans",
  "[&_pre]:font-lora [&_code]:font-lora",
];

// Highlight.js code block style configuration
export interface CodeStyleOption {
  id: string;
  name: string;
  cssFile: string;
  category: "light" | "dark" | "colorful";
  description?: string;
}

export const codeStyleOptions: CodeStyleOption[] = [
  // Light themes
  {
    id: "default",
    name: "Default",
    cssFile: "default.css",
    category: "light",
    description: "Clean and simple light theme",
  },
];

// Font configuration
export interface FontOption {
  id: string;
  name: string;
  base: string; // Body font
  heading: string; // Heading font
  mono: string; // Code font
}

// Font configuration - supports dynamic loading on demand
export const fontOptions: FontOption[] = [
  {
    id: "default",
    name: "Default (Noto Sans)",
    base: "font-sans",
    heading: "font-sans",
    mono: "font-mono",
  },
];
