-- ==============================================================================
-- Migration: Add dynamic legal_forms table and seed international legal forms
-- ==============================================================================

CREATE TABLE IF NOT EXISTS legal_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    country_code VARCHAR(8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public Read via Row Level Security
ALTER TABLE legal_forms ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'legal_forms' AND policyname = 'Public legal_forms read'
    ) THEN
        CREATE POLICY "Public legal_forms read" ON legal_forms FOR SELECT USING (true);
    END IF;
END $$;

-- Seed comprehensive international corporate forms
INSERT INTO legal_forms (code, name, country_code) VALUES
    -- Germany / DACH
    ('GMBH', 'GmbH', 'DE'),
    ('AG', 'AG', 'DE'),
    ('UG', 'UG (haftungsbeschränkt)', 'DE'),
    ('EINZEL', 'Einzelunternehmen', 'DE'),
    ('GBR', 'GbR', 'DE'),
    ('FREIBERUF', 'Freiberufler', 'DE'),
    ('GMBH_CO_KG', 'GmbH & Co. KG', 'DE'),
    ('KG', 'KG', 'DE'),
    ('OHG', 'OHG', 'DE'),
    ('EV', 'e.V.', 'DE'),

    -- United States & Americas
    ('LLC', 'LLC', 'US'),
    ('INC', 'Inc. / Corporation', 'US'),
    ('C_CORP', 'C-Corp', 'US'),
    ('S_CORP', 'S-Corp', 'US'),
    ('LLP_US', 'LLP', 'US'),

    -- United Kingdom & Commonwealth
    ('LTD', 'Ltd', 'GB'),
    ('PLC', 'PLC', 'GB'),
    ('LLP_GB', 'LLP', 'GB'),

    -- France / Romance
    ('SAS', 'SAS', 'FR'),
    ('SARL', 'SARL', 'FR'),
    ('SA', 'SA', 'FR'),

    -- India
    ('PVT_LTD', 'Pvt Ltd', 'IN'),
    ('PUBLIC_LTD', 'Public Ltd', 'IN'),
    ('OPC', 'OPC', 'IN'),

    -- Netherlands
    ('BV', 'B.V.', 'NL'),
    ('NV', 'N.V.', 'NL'),

    -- Spain & Latin America
    ('SL', 'S.L.', 'ES'),

    -- Italy
    ('SRL', 'S.r.l.', 'IT'),

    -- Australia / NZ
    ('PTY_LTD', 'Pty Ltd', 'AU')
ON CONFLICT (code) DO NOTHING;
