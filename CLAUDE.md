# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

Natural Highs Clone Vault is a Next.js 15 e-commerce site for cannabis clones and genetics, built with App Router, TypeScript, and Tailwind CSS v4.

### Key Directories

- `app/` - Next.js App Router pages and layouts (home, strains listing/detail, cart)
- `_components/` - Reusable React components organized by feature
  - `navigation/` - Header and footer with mobile/desktop variants
  - `home-page/` - Hero slider, featured strains, contact form, about section
  - `strains-page/` - Strain cards, filtering, search, pagination
  - `strain-page/` - Individual strain detail components
  - `cart-page/` - Cart items and order summary
  - `ui/` - General UI components (buttons, badges, contact info)
- `_actions/` - Server Actions for backend functionality (contact/order email processing)
- `_contexts/` - React Context providers (CartContext for state management)
- `_types/` - TypeScript type definitions
- `_lib/` - Utility functions (metadata generators, SEO utilities, email templates, reCAPTCHA verification)
- `_data/` - Static JSON data (strains catalog, navigation menu, general site data)
- `_styles/` - Global CSS and Tailwind configuration
- `public/` - Static assets (logos, images, icons, favicons)

### Custom Styling System

The project uses a custom Tailwind CSS v4 configuration with CSS variables defined in `_styles/globals.css`. Key customizations:

- **Custom Colors**: `text-black` (#353535), `text-white` (#FFFFFF), `text-green` (#66e00b), `text-red` (#D64040)
- **Typography Classes**: `text-paragraph` (1rem, weight 300), `text-subheading` (1.25rem, weight 600), `text-heading` (2.5rem, weight 300)
- **Breakpoints**: `phone:` (425px), `tablet:` (800px), `desktop:` (1280px)
- **Spacing**: `margin-15`/`padding-15`/`gap-15` (60px), `margin-30`/`padding-30`/`gap-30` (120px)
- **Font**: Spectral (weights 300, 400, 500, 600) with small-caps variant on headings

### Architecture Patterns

- **Responsive Components**: Components split into mobile/desktop variants (e.g., `MobileHeader`, `DesktopHeader`)
- **Server Components**: Pages are async Server Components by default; client directives used only for hooks
- **Server Actions**: Backend functionality using "use server" directive in `_actions/` for form processing
- **Context-Based State**: CartContext provides shopping cart state with localStorage persistence
- **Static Generation**: Strain pages pre-rendered at build time using `generateStaticParams()`
- **Dynamic Routing**: Strain detail pages use `/strains/[strain-slug]` pattern
- **Component Organization**: Components grouped by feature area with clear naming conventions

### External Dependencies

- **Swiper**: Carousel/slider functionality (hero slider, strain image galleries)
- **Nodemailer**: Server-side email delivery for forms and order confirmations
- **classnames**: Conditional CSS class management (preferred over template literals)
- **react-google-recaptcha-v3**: reCAPTCHA integration for form spam protection

### Path Configuration

Uses `@/*` alias pointing to root directory for imports (configured in tsconfig.json).

## Component Conventions

- **Prop Naming**: Components use `cssClasses` prop instead of `className` for styling
- **Images**: Always use Next.js `<Image />` component (never raw `<img>`)
- **Links**: Always use Next.js `<Link>` component (never raw `<a>`)
- **Client Directive**: Add `"use client"` to components using hooks (useState, useEffect, useContext, etc.)
- **Hover States**: Only apply hover states on `desktop:` breakpoint, not on `phone:` or `tablet:`
- **Clickable Elements**: All buttons/clickable elements must include `desktop:hover:cursor-pointer` class
- **Text Color**: Apply text colors directly to text elements (p, span, a) rather than parent divs

## Data Architecture

### Strain Data (`_data/strains-data.json`)
Each strain object contains:
```typescript
{
  title: string
  price: number
  inStock: boolean
  images: string[]
  description: string[]
  supplier: string
  type?: string          // e.g., "Hybrid"
  tac?: string          // e.g., "25%"
  effects?: string
  yield?: string
  floweringTime?: string
  terpeneProfile?: string
}
```

### Navigation Data (`_data/nav-data.json`)
Array of navigation menu items with title and URL.

### General Site Data (`_data/general-data.json`)
Contact information (email, phone) and hero slider image configurations.

## Cart & E-commerce

- **State Management**: CartContext (`_contexts/cart-context.tsx`) manages cart items with add/remove/update operations
- **Persistence**: Cart automatically synced to localStorage with hydration safety checks
- **Item Limit**: Maximum 99 items per product
- **Order Flow**: Email-based checkout with order number generation and confirmation emails
- **Email Templates**: HTML templates for contact forms and order confirmations in `_lib/`

## SEO & Metadata

- **Metadata Utilities** (`_lib/metadata.ts`): Functions for creating page metadata with OpenGraph and Twitter cards
  - `createBaseMetadata()` - Site-wide defaults
  - `createPageMetadata()` - Page-specific metadata
  - `createStrainMetadata()` - Product page metadata
- **Structured Data** (`_lib/seo-utils.ts`): Schema.org JSON-LD generation for Product, Organization, LocalBusiness, and Breadcrumb schemas
- **Dynamic Sitemap** (`app/sitemap.ts`): Auto-generated from strain data
- **Robots.txt** (`app/robots.ts`): Search engine directives

## Form Handling

- **Server Actions**: Contact and order forms use "use server" Server Actions for processing
- **Email Delivery**: Nodemailer configured with SMTP (details in `.env.local`)
- **reCAPTCHA v3**: Form protection with server-side verification in `_lib/verify-recaptcha.ts`
- **Honeypot**: Additional spam prevention field
- **Environment Variables** (`.env.local`):
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` - Email server settings
  - `SMTP_SEND_TO` - Recipient email for contact/order forms
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Client-side reCAPTCHA key
  - `RECAPTCHA_SECRET_KEY` - Server-side reCAPTCHA verification key
