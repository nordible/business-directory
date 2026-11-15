# Nordible Business Directory – AI Discoverability TODOs

**Project:** AI Discoverability Improvements  
**Platform:** Nordible Business Directory

---

# Priority 1 — Improve `llms.txt`

## Structure

- [ ] Add a concise executive summary at the top.
- [ ] Separate factual information from marketing copy.
- [ ] Keep marketing claims out of technical sections.
- [ ] Organize the document into clearly titled sections.
- [ ] Add document version.
- [ ] Add "Last Updated" date.

---

## Platform Description

- [ ] Add an "About Nordible Business Directory" section.
- [ ] Clearly explain what the directory does.
- [ ] Describe who the directory is for.
- [ ] Explain how businesses benefit from being listed.
- [ ] State supported countries.
- [ ] State supported languages.
- [ ] State that listings are publicly accessible after approval.

---

## Capabilities

Create a machine-readable capabilities section.

- [ ] International business directory
- [ ] Free business listings
- [ ] Public business profiles
- [ ] Human moderation
- [ ] Business verification
- [ ] Multilingual support
- [ ] AI-friendly metadata
- [ ] Structured Schema.org markup
- [ ] Searchable categories
- [ ] Public REST API

---

## AI Crawling Guidance

Add a dedicated section for AI systems.

- [ ] Explain which pages may be indexed.
- [ ] Explain that unpublished businesses must not be treated as public.
- [ ] State that published business pages are canonical.
- [ ] Explain that browsing requires no authentication.
- [ ] Clarify that the submission API is intended for automated workflows.

---

## API Documentation

Expand API documentation.

- [ ] Authentication requirements
- [ ] Rate limits
- [ ] Supported headers
- [ ] Required fields
- [ ] Optional fields
- [ ] Response codes
- [ ] Error codes
- [ ] Validation rules

---

## API Examples

Provide request and response examples.

- [ ] Successful submission example
- [ ] Validation error example
- [ ] Duplicate submission example
- [ ] Internal server error example

---

## Future API Endpoints

Document planned endpoints.

- [ ] GET /categories
- [ ] GET /businesses
- [ ] GET /businesses/{slug}
- [ ] GET /search
- [ ] GET /languages
- [ ] GET /industries

---

## Data Usage

Add a section describing data usage.

- [ ] Explain ownership of business data.
- [ ] Explain acceptable indexing.
- [ ] Explain attribution expectations.
- [ ] Explain public profile licensing.
- [ ] Clarify privacy expectations.

---

# Priority 2 — Site Discoverability

- [ ] Publish `/llms.txt` on `https://nordible.co/`.
- [ ] Keep `/llms.txt` on the Business Directory subdomain.
- [ ] Synchronize both copies.
- [ ] Verify HTTP 200 responses.
- [ ] Ensure `Content-Type: text/plain`.
- [ ] Avoid unnecessary redirects.
- [ ] Ensure anonymous access.
- [ ] Add footer link to `llms.txt`.
- [ ] Include `llms.txt` in XML sitemap.
- [ ] Add HTTP `Link` headers referencing `llms.txt`.

---

# Priority 3 — Technical SEO

- [ ] Validate `robots.txt`.
- [ ] Validate `sitemap.xml`.
- [ ] Submit sitemap to Google Search Console.
- [ ] Submit sitemap to Bing Webmaster Tools.
- [ ] Ensure canonical URLs are correct.
- [ ] Improve internal linking.
- [ ] Remove duplicate metadata.
- [ ] Verify hreflang implementation.

---

# Priority 4 — Structured Data

## Business Pages

- [ ] Organization schema
- [ ] LocalBusiness schema
- [ ] PostalAddress
- [ ] GeoCoordinates
- [ ] ContactPoint
- [ ] OpeningHoursSpecification
- [ ] AggregateRating
- [ ] Review schema
- [ ] FAQ schema
- [ ] sameAs links
- [ ] Logo
- [ ] Images

## Directory Pages

- [ ] CollectionPage
- [ ] ItemList
- [ ] SearchAction
- [ ] BreadcrumbList
- [ ] WebSite schema

---

# Priority 5 — AI Readability

- [ ] Improve semantic HTML.
- [ ] Use descriptive headings.
- [ ] Add concise summaries.
- [ ] Add FAQ sections.
- [ ] Keep important content visible without JavaScript.
- [ ] Avoid excessive marketing language.
- [ ] Ensure plain-language descriptions.

---

# Priority 6 — Business Profiles

Each published business should include:

- [ ] Business name
- [ ] Description
- [ ] Categories
- [ ] Services
- [ ] Products
- [ ] Address
- [ ] Website
- [ ] Email
- [ ] Phone
- [ ] Opening hours
- [ ] Images
- [ ] Logo
- [ ] Reviews
- [ ] FAQs
- [ ] Social profiles
- [ ] Verification status
- [ ] Last updated date

---

# Priority 7 — Machine-Readable Resources

Create additional resources.

- [ ] `/llms.txt`
- [ ] `/llms-full.txt`
- [ ] `/openapi.json`
- [ ] `/schema.json`
- [ ] `/identity.json`
- [ ] `/.well-known/ai.json`
- [ ] `/robots.txt`
- [ ] `/sitemap.xml`

---

# Priority 8 — AI Integration Improvements

- [ ] Publish OpenAPI specification.
- [ ] Publish JSON Schema for Business objects.
- [ ] Publish machine-readable category list.
- [ ] Publish supported language list.
- [ ] Publish API changelog.
- [ ] Add API versioning.

---

# Priority 9 — Performance

- [ ] Improve Core Web Vitals.
- [ ] Optimize LCP.
- [ ] Optimize INP.
- [ ] Optimize CLS.
- [ ] Compress images.
- [ ] Enable Brotli/Gzip.
- [ ] Serve assets via CDN.
- [ ] Optimize caching.

---

# Priority 10 — Validation

- [ ] Google Rich Results Test
- [ ] Schema.org Validator
- [ ] Google Search Console
- [ ] Bing Webmaster Tools
- [ ] Validate JSON-LD
- [ ] Validate `llms.txt`
- [ ] Test without JavaScript
- [ ] Test crawlability
- [ ] Test API documentation

---

# Important Content Changes

- [ ] Remove wording that guarantees discoverability in ChatGPT, Gemini, Perplexity, or other AI systems.
- [ ] Replace guarantees with factual descriptions of structured metadata and public accessibility.
- [ ] Clearly distinguish between facts and promotional messaging.
- [ ] Add objective platform capabilities instead of marketing claims.

---

# Future Features

- [ ] AI Discoverability Score
- [ ] AI Readiness Score
- [ ] Schema Completeness Score
- [ ] Business Profile Completeness Score
- [ ] Citation Health Score
- [ ] Knowledge Graph Score

---

# Success Criteria

- AI systems can easily understand the platform.
- Public business pages expose structured metadata.
- APIs are well documented.
- Machine-readable resources are available.
- Business information is discoverable by both humans and AI systems.
- Technical documentation is factual, versioned, and easy for autonomous agents to consume.