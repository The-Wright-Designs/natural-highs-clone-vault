# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15 project using the App Router architecture with TypeScript and Tailwind CSS v4.

### Key Directories

- `app/` - Next.js App Router pages and layouts
- `_components/` - Reusable React components organized by feature
  - `navigation/` - Header and footer components with mobile/desktop variants
  - `ui/` - General UI components like buttons
- `_actions/` - Server Actions for backend functionality
- `_types/` - TypeScript type definitions
- `_styles/` - Global CSS and Tailwind configuration
- `public/` - Static assets

### Custom Styling System

The project uses a custom Tailwind CSS v4 configuration with CSS variables defined in `_styles/globals.css`. Key customizations:

- **Custom Colors**: `text-black` (#353535), `text-white` (#FFFFFF), `text-green` (#76a865), `text-link-blue` (#0000ff)
- **Typography Classes**: `text-paragraph` (1rem, weight 200), `text-subheading` (1.25rem, weight 600), `text-heading` (2.5rem, weight 200)
- **Breakpoints**: `phone:` (425px), `tablet:` (800px), `desktop:` (1280px)
- **Spacing**: `margin-15`/`padding-15`/`gap-15` (60px), `margin-30`/`padding-30`/`gap-30` (120px)

### Architecture Patterns

- **Responsive Components**: Components split into mobile/desktop variants (e.g., `MobileHeader`, `DesktopHeader`)
- **Server Actions**: Backend functionality in `_actions/` directory using "use server" directive
- **Type Safety**: Comprehensive TypeScript setup with custom types in `_types/`
- **Font System**: Uses Spectral font (weights 200, 600) loaded via next/font
- **Component Organization**: Components grouped by feature area with clear naming conventions

### External Dependencies

- **Swiper**: For carousel/slider functionality with custom styling
- **Nodemailer**: For email functionality in server actions
- **classnames**: For conditional CSS class management
- **react-google-recaptcha**: For form protection

### Path Configuration

Uses `@/*` alias pointing to root directory for imports (configured in tsconfig.json).
