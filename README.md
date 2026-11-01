# Nordible for Businesses — Agentic, Free and Open Source B2B Directory

[![Live Platform](https://img.shields.io/badge/Live-business--directory.nordible.co-blue?style=flat-square)](http://business-directory.nordible.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-FOSS-blueviolet?style=flat-square)](https://github.com/nordible/business-directory)
[![Architecture](https://img.shields.io/badge/Architecture-Agentic%20AI-purple?style=flat-square)](http://business-directory.nordible.co/)
[![Commission](https://img.shields.io/badge/Commission-0%25%20Free%20Forever-orange?style=flat-square)](http://business-directory.nordible.co/)

> **The Agentic, 100% Free, and Open-Source B2B Directory engineered to empower verified businesses with direct customer inquiries, 0% commissions, and native discoverability by autonomous AI search agents (ChatGPT, Perplexity, Gemini, Claude).**

---

## 🚀 The Three Pillars: Agentic, Free & Open Source

1. **🤖 Agentic**:
   - Built from the ground up for the agentic web era.
   - Every profile generates machine-readable `Schema.org` entity graphs (`Organization`, `LocalBusiness` JSON-LD) and exposes an AI crawler ingestion protocol.
   - When autonomous AI agents, ChatGPT Search, or Perplexity answer customer buying questions (*"Find me a verified B2B software partner in Frankfurt"*), the platform acts as an authoritative, structured entity index for agentic citations and recommendations.

2. **🎁 100% Free Forever (0% Commission)**:
   - Traditional directories and lead brokers (Yelp, Thumbtack, Bark, MyHammer) trap business owners behind paywalls, charging **15% to 30% cuts on closed deals** or €50+ for a single shared lead.
   - **Nordible for Businesses** is a completely free public service.
   - Direct connection via phone, email, and WhatsApp without broker lock-in. Every euro earned belongs 100% to the business owner.

3. **🔓 100% Open Source**:
   - We believe in full transparency and community ownership.
   - The entire codebase is freely available on GitHub under the permissive MIT license for businesses, developers, and regional chambers of commerce to inspect, customize, or self-host.

---

## ✨ Key Features

- **Direct Customer Inquiries**: Instant connection with prospective clients through integrated WhatsApp, direct phone calling, and email forms.
- **Generative Engine Optimization (GEO)**: Automated structured data formatted specifically for AI crawlers and LLM search agents.
- **Multi-Lingual Global Reach**: Native internationalization supporting 18+ languages (English, German, French, Spanish, Arabic, Hindi, and more).
- **White-Label Partner Capability**: Regional organizations, chambers of commerce, and agencies can launch their own localized or vertical business directory with custom branding and domains.
- **Mobile-First Ergonomics**: Designed around modern thumb-zone navigation standards for fast browsing on any device.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Structured Data**: `Schema.org` (LocalBusiness / Organization JSON-LD)

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nordible/business-directory.git
cd business-directory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SITE_URL=http://business-directory.nordible.co
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🤝 Contributing

We welcome community contributions! Feel free to open an issue or submit a pull request if you have ideas to make business discovery fairer and more accessible.

---

## 📄 License & Maintained By

Maintained by **[Nordible Technologies](https://nordible.co)** · Frankfurt am Main, Germany.  
Live Platform: [http://business-directory.nordible.co/](http://business-directory.nordible.co/)  
Official Repository: [https://github.com/nordible/business-directory](https://github.com/nordible/business-directory)
