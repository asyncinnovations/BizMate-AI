-- Users Table
-- Stores all users (admin, business owner, team members).
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'business_owner', 'team_member'
    language_preference VARCHAR(10) DEFAULT 'en', -- 'en', 'ar', 'hi'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Businesses Table
-- Stores business/company details for each user.
CREATE TABLE businesses (
    business_id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    trade_license_no VARCHAR(100) UNIQUE NOT NULL,
    vat_id VARCHAR(50),
    sector VARCHAR(100),
    logo_url VARCHAR(255),
    subscription_plan VARCHAR(50) DEFAULT 'freemium', -- 'freemium', 'premium', 'enterprise'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Team Members Table
-- Staff assigned to a business.
CREATE TABLE team_members (
    team_member_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    user_id INT REFERENCES users(user_id),
    role VARCHAR(50), -- 'accounting', 'HR', 'support'
    added_at TIMESTAMP DEFAULT NOW()
);
-- AI Queries Table
-- Stores all AI compliance/business Q&A interactions.
CREATE TABLE ai_queries (
    query_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    user_id INT REFERENCES users(user_id),
    question TEXT NOT NULL,
    ai_response JSONB, -- store AI answer, metadata, references
    language VARCHAR(10) DEFAULT 'en',
    saved_as_reminder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Invoices Table
-- Tracks invoices for businesses.
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    client_name VARCHAR(255),
    items JSONB NOT NULL, -- [{name, qty, price, vat}]
    subtotal NUMERIC(12,2),
    vat_amount NUMERIC(12,2),
    total_amount NUMERIC(12,2),
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'paid', 'unpaid', 'partial'
    due_date DATE,
    sent_via VARCHAR(50), -- 'email', 'whatsapp'
    pdf_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Expenses Table
-- Tracks business expenses.
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    title VARCHAR(255),
    amount NUMERIC(12,2),
    category VARCHAR(100),
    receipt_url VARCHAR(255),
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Reminders Table
-- For VAT, licenses, payroll, or custom reminders.
CREATE TABLE reminders (
    reminder_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    title VARCHAR(255),
    type VARCHAR(50), -- 'VAT', 'License', 'Payroll', 'Custom'
    due_date DATE NOT NULL,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Documents Table
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
-- Subscriptions Table
-- Track subscription plan, payments, renewal.
CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    plan VARCHAR(50), -- 'freemium', 'premium', 'enterprise'
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    payment_method VARCHAR(50), -- 'stripe', 'paypal'
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
-- Notifications Table
-- For reminders, alerts, AI insights, system notifications.
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    user_id INT REFERENCES users(user_id),
    type VARCHAR(50), -- 'email', 'push', 'whatsapp'
    title VARCHAR(255),
    message TEXT,
    read_status BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Integrations Table
-- Store API keys for WhatsApp, Instagram, payment gateways.
CREATE TABLE integrations (
    integration_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    type VARCHAR(50), -- 'WhatsApp', 'Instagram', 'Stripe', 'PayPal'
    config JSONB, -- store API keys, webhook URLs, tokens
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Analytics / Logs Table
-- Store user actions, AI suggestions, invoice sends.
CREATE TABLE activity_logs (
    log_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id),
    user_id INT REFERENCES users(user_id),
    module VARCHAR(50), -- 'Invoice', 'AI Chat', 'Reminder'
    action VARCHAR(100), -- 'Created', 'Edited', 'Deleted', 'Sent'
    metadata JSONB, -- Optional details (invoice_id, reminder_id, etc.)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Multi-language AI Q&A
-- Multi-user businesses with team roles
-- AI logs, document automation
-- Invoices + VAT + payment tracking
-- Reminders & notifications
-- Subscriptions + integrations