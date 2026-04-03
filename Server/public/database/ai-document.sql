-- Stores document metadata. Each document is linked to a user.
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- e.g., 'custom', 'prebuilt'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Stores dynamic fields for each document. Supports adding/removing fields per document.
CREATE TABLE template_fields (
    id SERIAL PRIMARY KEY,
    template_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT,
    field_type VARCHAR(255),
    required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Stores prebuilt templates with default field schema.
--  CREATE TEMPLATE
-- DELETE TEMPLATE
-- UPDATE TEMPLATE
-- GET SINGLE TEMPLATE
-- GET ALL TEMPLATE
-- SINGLE TABLE FOR ALL
-- Unified Templates Table (Prebuilt + User-Created)
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,                  -- Internal unique ID
    uuid UUID DEFAULT gen_random_uuid(),    -- Public identifier for templates
    template_name VARCHAR(255) NOT NULL,   -- Template title
    description TEXT,                       -- Optional description
    fields_schema JSONB NOT NULL,           -- JSON of field names + default values
    user_id INT NULL REFERENCES users(id) ON DELETE SET NULL, -- Owner (NULL = system template)
    is_prebuilt BOOLEAN DEFAULT FALSE,      -- TRUE = system template, FALSE = user template
    version INT DEFAULT 1,                  -- Versioning for templates
    is_active BOOLEAN DEFAULT TRUE,         -- Soft delete / enable/disable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prebuilt_templates (
    id SERIAL PRIMARY KEY,
    uuid,
    template_name VARCHAR(255) NOT NULL,              -- Template title
    description TEXT,                                 -- Optional description
    fields_schema JSONB NOT NULL,                     -- JSON of field names + default values
    created_by_user_id UUID NULL,      -- Optional: if a user creates a template
    is_active BOOLEAN DEFAULT TRUE,                   -- Soft delete / enable/disable
    version INT DEFAULT 1,                             -- Optional: versioning for templates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Optional table to separate user-saved templates from actual documents.
CREATE TABLE user_templates (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_name VARCHAR(255) NOT NULL,
    fields_schema JSONB, -- JSON of field names + default values
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tracks recently accessed documents per user (for sidebar display).
CREATE TABLE recent_documents (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Generated contracts, NDA, employment letters, invoices.
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    template_type VARCHAR(50), -- 'NDA', 'Contract', 'Employment', 'Invoice'
    title VARCHAR(255),
    fields JSONB, -- {company_name, client_name, dates, etc.}
    pdf_url VARCHAR(255),
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW()
);
-- npx sequelize-cli migration:generate --name payroll_runs-table