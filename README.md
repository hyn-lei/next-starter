# Modern SaaS Development Platform

A comprehensive Next.js-based SaaS development starter template with multi-language support, user authentication, payment integration, and modern web technologies.

## 🚀 Features Overview

### ✅ Core Framework & Architecture
- **Next.js 16 + React 19** - Multi-layout and multi-language support with the App Router
- **404 Not Found** pages with internationalization
- **ESLint configuration** - Optimized with unused-var detection disabled
- **proxy.ts** - Unified Clerk authentication and next-intl locale routing
- **File structure**: `app/`, `app/api/`, `components/`, `lib/`, `hooks/`, `content/`
- **Health check endpoint**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### ✅ Styling & UI
- **Tailwind CSS** (Latest) with `@tailwindcss/typography`
- **shadcn/ui** (Latest) - Modern component library
- **next-themes** - Theme provider with light/dark mode toggle
- **Responsive design** - Mobile-first approach

### ✅ SEO & Performance
- **next-sitemap** (Latest) - Automatic sitemap generation
- **Dynamic Google Fonts loading** - Performance optimized with `useDynamicFont`
- **Dynamic highlight.js styles** - On-demand loading with `useHighlightStyle`
- **JSON-LD structured data** - SEO optimization with `useJsonLd`

### ✅ Internationalization (i18n)
- **next-intl** (Latest) - Complete i18n solution
- **Multi-language support**: English, Chinese, German, Spanish, Portuguese, Japanese
- **I18nLink component** - Automatic localized routing
- **SEO optimization** - Localized titles, descriptions from language files
- **Content localization** - Privacy policy and terms in all languages

### ✅ Authentication & User Management
- **Clerk** - Complete authentication solution
  - `@clerk/localizations` - Multi-language auth UI
  - `@clerk/nextjs` - Next.js integration
  - `@clerk/themes` - Theme customization
- **Protected routes**: `/profile`, `/signin`, `/signup`

### ✅ Payment Integration
- **Creem.io** - Payment processing support
- Credit system with purchase history
- Webhook handling for payment verification

### ✅ Content & Markdown Support
- **react-markdown** - Rich markdown rendering
- **react-syntax-highlighter** - Code highlighting
- **rehype-autolink-headings** - Auto-generated heading links
- **rehype-highlight** - Server-side syntax highlighting
- **rehype-katex** - Math formula rendering
- **rehype-raw** - HTML in markdown support
- **remark-gfm** - GitHub flavored markdown
- **remark-unwrap-images** - Image optimization
- **mermaid** - Diagram support

### ✅ Development Tools
- **Prettier** - Code formatting
- **VS Code configuration** - Auto-format on save (requires Prettier extension)
- **TypeScript** - Full type safety
- **Turbopack** - Enabled for `npm run dev` and `npm run build` for faster rebuilds

### ✅ Advertising & Analytics
- **Google Analytics** - Dynamic loading
- **Google AdSense** - Manual ad loading with optimization
  - Sidebar ads for desktop
  - Banner ads between sections
  - Lazy loading - ads appear when scrolled into view
  - Multiple ad types for better revenue
- **public/ads.txt** - AdSense verification

### ✅ Components & Pages
- **Homepage** - Modern landing page
- **Privacy Policy** - Multi-language legal documents
- **Terms of Service** - Complete legal coverage
- **Contact Page** - Contact form with validation
- **Navigation** - Top navigation and footer
- **Blog entry points** - Ready for content management
- **Font configuration** - Browser default fonts instead of Inter

### ✅ Performance Optimizations
- **Dynamic font loading** - No multiple Google Fonts blocking
- **Dynamic highlight styles** - On-demand code theme loading
- **Lazy ad loading** - Improved Core Web Vitals
- **Image optimization** - Next.js built-in optimization

## 🔧 Environment Setup

### Prerequisites
```bash
# Node.js 18+ required
node --version

# Install dependencies
npm install
```

### Environment Variables
Create `.env.local` based on `.env.example`:
```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Payment
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=
CREEM_SERVER_MODE=1
CREEM_PRODUCT_BASIC=
CREEM_PRODUCT_PREMIUM=

# URLs
NEXT_PUBLIC_BASE_URL=

# Database (if using Prisma)
DATABASE_URL=
```

### Database Setup (Optional)
If using Prisma with PostgreSQL:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## 🏃‍♂️ Getting Started

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) during development or [http://localhost:3003](http://localhost:3003) after `npm start`.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── content/              # Multi-language legal documents
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── messages/             # i18n translation files
├── public/               # Static assets
└── proxy.ts              # Clerk + next-intl proxy handler
```

## 🌍 Supported Languages

- **English** (en) - Default
- **Chinese** (zh) - 中文
- **German** (de) - Deutsch
- **Spanish** (es) - Español
- **Portuguese** (pt) - Português
- **Japanese** (ja) - 日本語

## ⚠️ Known Limitations

- **Build issues** - Currently only supports `npm run dev` for development
- **Form validation** - `react-hook-form` + `zod` not yet implemented
- **CMS integration** - Directus SDK blog pagination not yet implemented

## 🔄 Pending Features

- [ ] Form validation with react-hook-form & zod
- [ ] Directus CMS integration for blog
- [ ] Production build optimization

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using modern web technologies for the global SaaS community.
