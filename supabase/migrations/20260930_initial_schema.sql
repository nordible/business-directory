-- ==============================================================================
-- Nordible Directory — PostgreSQL & Supabase Database Migration
-- Phase 3: Multi-Tenant Architecture & Row-Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline_de TEXT NOT NULL,
    tagline_en TEXT NOT NULL,
    primary_color VARCHAR(9) NOT NULL DEFAULT '#0284c7',
    accent_color VARCHAR(9) NOT NULL DEFAULT '#0369a1',
    logo_text VARCHAR(64) NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant subdomain / domain lookup in Next.js Proxy
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants (slug);
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain ON tenants (custom_domain);

-- 3. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'visitor' CHECK (role IN ('visitor', 'business_owner', 'tenant_admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users (tenant_id);

-- 4. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    name_de VARCHAR(128) NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    icon VARCHAR(64) NOT NULL DEFAULT 'Grid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_category_slug UNIQUE (tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON categories (tenant_id);

-- 5. Create Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description_de TEXT,
    description_en TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    phone VARCHAR(64),
    website VARCHAR(512),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_open_now BOOLEAN NOT NULL DEFAULT TRUE,
    hours VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_tenant_id ON businesses (tenant_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON businesses (category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses (city);

-- ==============================================================================
-- 6. Row-Level Security (RLS) Isolation Policies
-- ==============================================================================

-- Enable RLS on all directory tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Tenants Policies
CREATE POLICY "Public tenants are viewable by everyone"
    ON tenants FOR SELECT
    USING (true);

-- Categories Policies
CREATE POLICY "Public categories are viewable by everyone"
    ON categories FOR SELECT
    USING (true);

-- Businesses Policies (Public Read)
CREATE POLICY "Public businesses are viewable by everyone"
    ON businesses FOR SELECT
    USING (true);

-- Businesses Policies (Insert via AI or authenticated owner)
CREATE POLICY "Anyone can submit a business listing draft"
    ON businesses FOR INSERT
    WITH CHECK (true);

-- Businesses Policies (Update only by owner or tenant admin)
CREATE POLICY "Owners and admins can update their businesses"
    ON businesses FOR UPDATE
    USING (
        auth.uid() = owner_id
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.tenant_id = businesses.tenant_id
            AND users.role IN ('tenant_admin', 'super_admin')
        )
    );

-- ==============================================================================
-- 7. Seed Data: Default Tenants, Categories & Businesses
-- ==============================================================================

INSERT INTO tenants (id, slug, name, tagline_de, tagline_en, primary_color, accent_color, logo_text, custom_domain)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'handwerk-berlin', 'Berliner Meisterbetriebe', 'Ihr regionales Verzeichnis für zertifiziertes Handwerk in Berlin & Brandenburg', 'Your regional directory for certified craft businesses in Berlin & Brandenburg', '#0284c7', '#0369a1', '🛠️ BerlinCraft', 'berlin-meister.de'),
    ('22222222-2222-2222-2222-222222222222', 'nordic-tech', 'Nordic Tech & Design Index', 'Entdecken Sie innovative IT-Agenturen, SaaS-Startups und Designstudios', 'Discover innovative IT agencies, SaaS startups, and design studios', '#059669', '#047857', '⚡ NordicHub', 'nordictech.io'),
    ('33333333-3333-3333-3333-333333333333', 'alpen-genuss', 'Alpen Genuss Guide', 'Traditionelle Bäckereien, Gasthäuser und regionale Spezialitäten', 'Traditional bakeries, local taverns, and regional specialties', '#b45309', '#92400e', '🥨 AlpenGenuss', 'alpengenuss.at')
ON CONFLICT (slug) DO NOTHING;

-- Seed Categories for Berlin
INSERT INTO categories (id, tenant_id, slug, name_de, name_en, icon)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'handwerk', 'Handwerk & Bau', 'Crafts & Construction', 'Hammer'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'gastronomie', 'Café & Bäckerei', 'Café & Bakery', 'Coffee'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'gesundheit', 'Gesundheit & Praxis', 'Health & Practice', 'HeartPulse')
ON CONFLICT DO NOTHING;

-- Seed Businesses for Berlin
INSERT INTO businesses (tenant_id, category_id, name, description_de, description_en, address, city, phone, website, rating, review_count, is_verified, is_open_now, hours)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Müller & Söhne Schreinerei', 'Zertifizierter Meisterbetrieb für maßgefertigte Holzmöbel, Denkmalschutz und Innenausbau.', 'Certified master carpenter for custom wooden furniture, historic preservation, and interior fittings.', 'Bergmannstraße 102', '10961 Berlin', '+49 30 1234567', 'https://schreinerei-mueller.de', 4.9, 38, true, true, 'Mo-Fr 07:30 - 17:00'),
    ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Kiezbäckerei Goldkruste', 'Traditionelles Bäckerhandwerk mit reinem Natursauerteig und Bio-Mehl aus Brandenburg.', 'Traditional artisan bakery using 100% natural sourdough and regional organic grain.', 'Schönhauser Allee 44', '10435 Berlin', '+49 30 9876543', 'https://goldkruste-berlin.de', 4.8, 112, true, true, 'Di-So 06:30 - 18:00')
ON CONFLICT DO NOTHING;
