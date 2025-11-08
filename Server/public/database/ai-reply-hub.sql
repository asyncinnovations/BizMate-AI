CREATE TABLE ai_reply_hub_chats(
    id INTEGER,
    uuid UUID,
    client_id UUID,
    user_id UUID,
    platform enum("whatsapp","email","instagram"),
    direction enum("inbound","outbound"),
    message text,
    ai_reply text nullable ,
    ai_reply_enable BOOLEAN default true,
    sent_at TIMESTAMP DEFAULT now(),
    status enum("sent","delivered","read","fails")
)
CREATE TABLE client_lists(
    id INTEGER,
    uuid UUID,
    user_id UUID,
    name VARCHAR(255),
    email VARCHAR(255),
    whatsapp_number VARCHAR(50),
    instagram_id VARCHAR(255),
    added_at TIMESTAMP default now()
)
CREATE TABLE user_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(50) CHECK (channel IN ('email', 'whatsapp', 'instagram')) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'connected',
    metadata JSONB,   -- store API keys, phone ID, IG business ID, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
