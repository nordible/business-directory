# 🗺️ Nordible Directory — Architecture & Development Roadmap

A modern, multi-tenant white-label business directory platform engineered with science-backed UX principles and AI-assisted listing onboarding.

---

## 👥 1. User Roles & Mental Models

| Role | German Equivalent | Core Need & Science-Backed UX Focus |
| :--- | :--- | :--- |
| **End User / Visitor** | *Besucher* | **Thumb-Zone Reachability (Fitts’s Law):** Fast discovery, bottom-anchored filters & search sheets requiring zero stretch to the top of mobile screens. |
| **Business Owner** | *Unternehmen* | **Cognitive Friction Reduction (Hick’s Law):** Zero-friction AI listing creation by simply dropping a URL or flyer, replacing 15+ manual form inputs. |
| **Tenant / Directory Owner** | *Mandant* | **Private Label / White-Labeling:** Full customization of branding (logo, primary theme color, tagline, custom domain) with instant live preview. |
| **Platform Operator** | *Super-Admin* | **Platform Governance:** Cross-tenant oversight, billing, tenant subscription management, and system telemetry. |

---

## 🎨 2. Science-Backed UX Architecture

1. **Ergonomic Thumb-Zone Navigation (Fitts’s Law):**
   * Primary interactions (Explore, Filter, Add Listing, Brand Customizer) are anchored in the fixed mobile bottom bar (`BottomNav`).
   * Touch targets meet the recommended minimum height of **48px** for error-free one-handed reachability.
2. **Bottom-Anchored Filter Sheets:**
   * Category and availability filters slide up from the bottom rather than dropping down from the top edge.
3. **Progressive Disclosure:**
   * Business listing cards display scannable essential data (ratings, verified status, category, location) upfront. Secondary information (phone, opening hours, website) unfolds smoothly upon request.
4. **Localization (i18n):**
   * UI copy is strictly decoupled into dedicated dictionary files (`src/locales/de.json` as default and `src/locales/en.json`).

---

## 🤖 3. AI-Powered Listing Onboarding

### The Problem
Traditional business directories demand tedious manual entry of 15+ form fields (legal notice /*Impressum*, business hours, contact numbers, categories), resulting in severe abandonment rates.

### The AI Workflow
```
[User Input: Website URL or Uploaded Document (PDF/Flyer/Business Card)]
                                │
                                ▼
                   [AI Extraction Pipeline]
              (LLM / Vision + Web Scraping)
                                │
                                ▼
                [Structured JSON Validation]
                - Business Name & Category
                - Address, City, Postal Code
                - Phone, Website, Email
                - Opening Hours & Core Services
                                │
                                ▼
               [Human-in-the-Loop Review Sheet]
        (1-Tap verification & editing inside bottom sheet)
                                │
                                ▼
                     [Published to Tenant]
```

### Recommended AI Tech Stack
* **Inputs:** Website URL (business homepage, Google Maps link, social page) or file upload (PDF, PNG, JPG).
* **Ingestion:** Cheerio / Puppeteer for web scraping; Vision LLM (or OCR) for photos/flyers.
* **Extraction Engine:** Gemini 2.5 Flash / OpenAI Structured Outputs (`zod` schema) guaranteeing strongly typed JSON responses.

---

## 🏢 4. Multi-Tenant White-Labeling Architecture

* **Dynamic Theming:** Brand colors injected via dynamic CSS custom properties (`--tenant-primary`, `--tenant-accent`), supporting real-time theme preview without recompilation.
* **Domain & Route Resolution (Next.js 16 Proxy):**
  * Subdomains: `berlincraft.directory.com` ➔ Tenant ID `t-1`
  * Custom Domains: `www.my-local-guide.de` ➔ Tenant ID `t-custom`
* **Data Isolation:** PostgreSQL with **Row-Level Security (RLS)** filtered by `tenant_id`.

---

## 🚀 5. Phased Development Roadmap

### ✅ Phase 1: MVP Frontend & Theming Foundation (Completed)
- [x] Next.js initialization (App Router, Tailwind CSS, TypeScript, ESLint with `--fix`).
- [x] Ergonomic Component System:
  - `Header`: Tenant brand identity, tenant switcher, language toggle.
  - `BottomNav`: Thumb-zone mobile navigation bar adhering to Fitts's Law.
  - `FilterSheet`: Slide-up bottom sheet for categories and active filters.
  - `BusinessCard`: Progressive disclosure listing card.
  - `TenantCustomizer`: Real-time white-label brand builder.
- [x] Decoupled localization engine with `src/locales/de.json` and `src/locales/en.json`.
- [x] Zero TypeScript errors and zero ESLint errors.

---

### ✅ Phase 2: AI Ingestion & Subdomain Routing (Completed)
- [x] **AI Ingestion Modal (`AiListingModal.tsx`):**
  - Ergonomic bottom sheet adhering to Fitts's Law for mobile thumb-reach.
  - Tab 1: Paste URL (automated scraping of Impressum & contact data) with quick sample chips.
  - Tab 2: Upload Flyer / Business Card (OCR & Vision LLM extraction).
  - Multi-step progress feedback (Nielsen visibility heuristic) and human-in-the-loop review.
- [x] **Next.js API Route (`/api/ai/extract`):**
  - Parsing service returning structured JSON matching `BusinessListing` schema.
- [x] **Multi-Tenant Proxy (`src/proxy.ts`):**
  - Host header resolution for tenant routing via custom domains & subdomains (Next.js 16 Proxy convention).
  - Dynamic preview override via `?tenant=<slug>`.


---

### ⏳ Phase 3: Database, Authentication & RLS (Schema & RLS Ready)
- [x] **Database Setup & Migrations:**
  - Supabase / PostgreSQL migration in `supabase/migrations/20260930_initial_schema.sql`.
  - Client data repository abstraction in `src/lib/db/client.ts`.
- [x] **Schema Definition:**
  - `tenants` (id, name, slug, custom_domain, branding, localized taglines).
  - `categories` (id, tenant_id, localized names, icon).
  - `businesses` (id, tenant_id, category_id, name, address, hours, ratings, verified).
  - `users` (id, tenant_id, email, role: visitor / business_owner / tenant_admin / super_admin).
  - Strongly typed TypeScript representations in `src/lib/db/schema.ts`.
- [x] **Row-Level Security (RLS):**
  - Public read policies for listings, categories, and tenant branding.
  - Multi-tenant tenant boundary checks and owner/admin update permissions.
- [ ] **Authentication Flow:**
  - Magic link / Supabase Auth integration for business owners & tenant admins.

---

### ✅ Phase 4: Business Claiming & Verification (Completed)
- [x] **Claim Listing Flow (`ClaimListingModal.tsx`):**
  - Seamless OTP / email verification flow for AI-generated listings.
  - Instantly promotes unverified listings to verified status upon completion.
- [x] **Business Dashboard (`BusinessDashboardModal.tsx`):**
  - Live management of opening hours, open/closed status toggle, contact details, and address.
  - Immediate state reflection in directory listings.
- [x] **Review & Rating Engine (`ReviewModal.tsx`):**
  - Star ratings, structured customer reviews, and automatic real-time average score recalculation.

---

### ✅ Phase 5: Monetization & White-Label SaaS (Completed)
- [x] **Stripe Billing (`PricingModal.tsx` & `/api/billing/checkout`):**
  - Tiered SaaS subscriptions (Starter €29/mo, Pro White-Label €79/mo, Enterprise €199/mo).
  - Monthly vs. Yearly billing toggle with 20% annual savings anchor.
  - Stripe Checkout session creation route.
- [x] **Automated Custom Domain & SSL (`DomainSettingsModal.tsx`):**
  - CNAME & DNS record guidance for external domains.
  - Live SSL TLS 1.3 encryption status check.
  - Instant domain saving and live routing support.

