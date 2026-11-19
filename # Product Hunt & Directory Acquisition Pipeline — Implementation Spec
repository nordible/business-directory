# Product Hunt & Directory Acquisition Pipeline — Implementation Spec

**Owner:** Nordible Technologies  
**Target Products:**  
1. Primary Hook: [Nordible Business Directory](https://nordible.co) (Free Verified Listing / 0% Commission)  
2. Secondary Cross-Sell: [Nordible Email](https://nordible.co) (€0.90/mo Custom Domain Hosting + 30-Day Free Trial)  
**Compliance Baseline:** German UWG (§ 7 Abs. 2 Nr. 2), EU GDPR, CAN-SPAM (US), PECR (UK)  

---

## 1. Architecture Overview

```text
[Daily Launch Sources] ──► [Ingestion & Deduplication] ──► [Geo & Compliance Filter]
                                                                    │
                                                      ┌─────────────┴─────────────┐
                                                      ▼                           ▼
                                             [EU / DE / AT / CH]         [Non-EU (US, UK, CA, etc.)]
                                              (DROP / NO EMAIL)                   │
                                                                                  ▼
                                                                   [AI Listing Pre-Generation]
                                                                                  │
                                                                                  ▼
                                                                   [Human-in-the-Loop QA Gate]
                                                                                  │
                                                                                  ▼
                                                                   [Throttled Outbound Email]
                                                                                  │
                                                                                  ▼
                                                                   [Claim Page ──► Email Upsell]
```

---

## 2. Phase-by-Phase To-Do Checklist

### Phase 1: Infrastructure & Compliance Setup (Days 1–3)
- [ ] **Purchase Secondary Sending Domains:** Register 2–3 lookalike domains (e.g., `joinnordible.com`, `nordibledirectory.com`) so primary `nordible.co` domain reputation is completely isolated.
- [ ] **Configure DNS Authentication:** Set up strict `SPF`, `DKIM`, and `DMARC` (`p=quarantine` or `p=reject`) records plus custom tracking domains on all sending domains.
- [ ] **Warm Up Sending Inboxes:** Create 1–2 mailboxes per secondary domain and run automated warmup for at least **14–21 days** before launching outbound campaigns.
- [ ] **Set Up Suppression & Geo-Blocklists:** Create a global suppression table in your database containing:
  - Blocked TLDs: `.de`, `.at`, `.ch`, `.eu`, `.fr`, `.nl`, `.it`, `.es`, `.pl`, `.se`, `.dk`, `.be`, `.ie`, `.fi`, `.pt`, `.cz`, `.gr`, `.hu`, `.ro`, `.bg`, `.hr`, `.sk`, `.si`, `.lt`, `.lv`, `.ee`, `.lu`, `.mt`, `.cy`
  - Blocked country keywords in website footers / Impressum: `Impressum`, `Amtsgericht`, `USt-IdNr`, `GmbH`, `UG (haftungsbeschränkt)`, `AG`, `Ltd` (if EU-registered), `S.A.R.L.`, `B.V.`

### Phase 2: Data Ingestion Pipeline (Days 4–6)
- [ ] **Product Hunt API Integration:**
  - Register an app in the Product Hunt Developer Dashboard and obtain a Bearer token.
  - Build a scheduled daily job (08:00 UTC) querying the Product Hunt GraphQL API (`posts` endpoint) for launches from the past 24 hours.
  - Extract: `name`, `tagline`, `website`, `makers` (name, Twitter/X handle, website), and `topics`.
- [ ] **Secondary Launch Directory Scrapers / RSS Feeds:**
  - Add ingestion parsers for **Uneed**, **MicroLaunch**, **BetaList**, and **Hacker News (`Show HN`)**.
- [ ] **Deduplication Layer:** Store canonical root domains in PostgreSQL/Supabase (`unique_domains` table) so a startup launched on multiple platforms is only contacted once.

### Phase 3: Enrichment & Strict Compliance Filtering (Days 7–9)
- [ ] **Resolve Redirects & Extract Metadata:** Follow product URLs to resolve final destination domains, scrape homepage `<title>`, `<meta name="description">`, footer address text, and contact email/founder links.
- [ ] **Automated Jurisdiction Check:**
  - Run an LLM classification step + WHOIS/IP/Footer check to determine company headquarters.
  - **Hard Rule:** If `country IN [EU_EEA_COUNTRIES, "Germany", "Austria", "Switzerland"]` OR `confidence < 0.85`, mark record `status = "EXCLUDED_JURISDICTION"` and halt email outreach.
- [ ] **Email Discovery & Verification:**
  - Enrich founder work email (via Explee, Hunter, Apollo, or website `mailto:` extraction).
  - Run SMTP verification to drop `invalid` or `catch-all` risky addresses (keep bounce rate `< 2%`).
  - Flag whether the founder is using a free webmail provider (`@gmail.com`, `@yahoo.com`, `@outlook.com`) as `is_free_email = true` for high-priority Nordible Email cross-selling.

### Phase 4: AI Listing Pre-Generation (Days 10–12)
- [ ] **Automate Draft Profile Creation:** Pass the verified company website into Nordible's **AI Listing Extraction** pipeline to generate a draft directory entry on `business-directory.nordible.co`.
- [ ] **Generate Unique Claim Token:** Create a secure, single-use magic claim URL (e.g., `https://nordible.coclaim/<slug>?token=<uuid>`).
- [ ] **Set Draft Visibility Rules:** Keep pre-generated profiles tagged as `Unclaimed / Draft` until the founder clicks the claim link and verifies ownership.

### Phase 5: Outbound Execution & QA Gate (Days 13–15)
- [ ] **Human-in-the-Loop Approval Queue:** Before sending, push daily enriched leads into a lightweight review queue (or Slack/Telegram digest) to verify:
  1. Founder name and product name match cleanly (no scraping artifacts).
  2. Company is genuinely outside the EU/EEA.
  3. Draft directory URL resolves properly.
- [ ] **Configure Sending Limits:**
  - Cap volume at **30–40 emails/day per inbox**.
  - Send plain-text emails only (no heavy HTML, no tracking pixels, max 1 link).
  - Include a clear physical mailing address and plain-text opt-out line in every email footer (CAN-SPAM compliant).

### Phase 6: Claim Funnel & Nordible Email Cross-Sell (Days 16–18)
- [ ] **Streamline 1-Click Claim Onboarding:** Allow founders landing on `/claim/<slug>` to review their AI-generated profile, edit details, and publish live in under 60 seconds.
- [ ] **Trigger Contextual Cross-Sell:**
  - If `is_free_email == true`, display an onboarding banner: *"Launching with a @gmail address? Upgrade to a custom `@yourdomain` inbox on Nordible Email for €0.90/mo — 30-day free trial included."*
  - If `is_free_email == false`, show: *"Cutting startup burn? Switch from Google Workspace to Nordible Email (€0.90/mo) with free zero-downtime migration."*

---

## 3. Approved Plain-Text Email Templates (Non-EU Only)

### Template A: Product Hunt Launch Congratulations + Pre-Built Listing
**Subject:** `Congrats on launching {{product_name}} on Product Hunt`

```text
Hi {{first_name}},

Saw {{product_name}} launch on Product Hunt today — congrats on shipping it.

To help early adopters and AI search tools discover {{product_name}}, we went ahead and generated a free, zero-commission profile for you on Nordible's global business directory:

{{claim_url}}

You can review the AI-extracted details, claim ownership in one click, or remove it anytime if you prefer not to be listed. No fees or middleman markups.

Best,
[Your Name]
Nordible Technologies
[Business Mailing Address]

---
Not interested? Reply "no" and I won't follow up again.
```

### Template B: Follow-Up (4 Days Later — Single Touch Only)
**Subject:** `Re: Congrats on launching {{product_name}} on Product Hunt`

```text
Hi {{first_name}},

Quick bump in case this got buried during launch week — your draft listing for {{product_name}} is ready whenever you want to claim or tweak it:

{{claim_url}}

Wishing you a strong post-launch week!

Best,
[Your Name]
```

---

## 4. Key Metrics & Guardrails to Monitor

| Metric | Target Threshold | Action if Breached |
| :--- | :--- | :--- |
| **Bounce Rate** | `< 2.0%` | Pause campaign; tighten SMTP verification filter |
| **Spam Complaint Rate** | `< 0.1%` | Audit copy; reduce daily per-inbox send volume |
| **Positive Reply / Claim Rate** | `> 8% – 15%` | A/B test subject line and claim landing page |
| **EU/German Leak Rate** | `0%` | Audit domain/footer geo-classifier rules immediately |
