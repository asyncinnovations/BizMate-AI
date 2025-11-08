 
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('VAT', 'License', 'Payroll', 'Custom')) NOT NULL,
    reminder_date TIMESTAMP NOT NULL,
    notify_before INTERVAL DEFAULT INTERVAL '3 days',
    notify_channels JSONB DEFAULT '{"email": true, "whatsapp": false, "push": true}',
    recurrence_rule VARCHAR(50) CHECK (recurrence_rule IN ('none', 'monthly', 'quarterly', 'yearly')) DEFAULT 'none',
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'completed', 'missed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(20) CHECK (channel IN ('email', 'whatsapp', 'push')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    ai_response JSONB,
    reminder_created UUID REFERENCES reminders(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- CREATE TABLE business_settings (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
--     -- Notification preferences
--     default_notify_channels JSONB DEFAULT '{"email": true, "whatsapp": false, "push": true}',

--     -- Language / localization
--     language VARCHAR(10) DEFAULT 'en', -- 'en', 'ar', 'hi', 'ur'

--     -- VAT & Tax settings
--     vat_percentage NUMERIC(5,2) DEFAULT 5.00,  -- default UAE VAT
--     vat_due_day INT DEFAULT 30,                -- default VAT filing day of month

--     -- License settings
--     license_type VARCHAR(50),                 -- e.g., 'LLC', 'Free Zone', 'Sole Proprietorship'
--     license_expiry_date DATE,

--     -- Reminders & notifications preferences
--     auto_create_reminders BOOLEAN DEFAULT true,
--     reminder_notify_days_before JSONB DEFAULT '{"VAT":3, "License":7, "Payroll":2}',

--     -- Other optional preferences
--     timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
--     theme VARCHAR(20) DEFAULT 'light',        -- light or dark
--     ai_tone VARCHAR(20) DEFAULT 'professional', -- tone for AI messages
    
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );




-- CREATE TABLE reminder_channels (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(50) UNIQUE NOT NULL,   -- e.g. 'Email', 'WhatsApp', 'Push'
--     api_provider VARCHAR(100),          -- e.g. SendGrid, Twilio, Firebase
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- CREATE TABLE reminder_notifications (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
--     channel_id UUID NOT NULL REFERENCES reminder_channels(id),
--     sent_at TIMESTAMP DEFAULT NOW(),
--     delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed')),
--     response_message TEXT,
--     error_message TEXT
-- );
-- CREATE TABLE user_preferences (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     default_notify_before INTERVAL DEFAULT INTERVAL '3 days',
--     default_channels JSONB DEFAULT '{"email": true, "whatsapp": true, "push": false}',
--     language_preference VARCHAR(10) DEFAULT 'en',
--     timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );
