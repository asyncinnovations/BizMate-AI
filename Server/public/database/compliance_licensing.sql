CREATE TABLE compliance_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,           -- Owner of the license
    company_id UUID,                 -- Company this license belongs to
    license_type VARCHAR(100) NOT NULL,  -- e.g., Trade License, Professional License
    license_number VARCHAR(100),         -- Unique license number
    issue_date DATE,                      -- License issue date
    expiry_date DATE,                      -- License expiry date
    status VARCHAR(50) DEFAULT 'active',  -- active, expired, suspended
    document_id UUID,                      -- Link to uploaded document (optional)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (document_id) REFERENCES compliance_documents(id)
);
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,               -- Recipient of notification
    company_id UUID,                      -- Optional, for company-level notifications
    reminder_id UUID,                     -- Optional, if notification is linked to a reminder
    document_id UUID,                     -- Optional, if notification is linked to a document
    notification_type VARCHAR(50) NOT NULL,  -- e.g., email, sms, push, dashboard
    title VARCHAR(255),                   -- Notification title
    message TEXT NOT NULL,                -- Notification content
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP,                    -- Timestamp when notification was actually sent
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (reminder_id) REFERENCES compliance_reminders(id),
    FOREIGN KEY (document_id) REFERENCES compliance_documents(id)
);
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,                -- User who owns the preference
    company_id UUID,                       -- Optional, for company-level preferences
    event_type VARCHAR(100) NOT NULL,      -- e.g., vat_filing, license_expiry, ai_reminder
    email_enabled BOOLEAN DEFAULT TRUE,    -- Receive email notifications
    sms_enabled BOOLEAN DEFAULT FALSE,     -- Receive SMS notifications
    push_enabled BOOLEAN DEFAULT TRUE,     -- Receive push notifications
    dashboard_enabled BOOLEAN DEFAULT TRUE,-- Show in dashboard alerts
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
