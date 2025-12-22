CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(uuid),
    device_name VARCHAR(255),        -- e.g., "Chrome on MacBook Pro"
    ip_address VARCHAR(50),          -- e.g., "103.23.45.67"
    location VARCHAR(255),           -- e.g., "Dubai, UAE"
    browser VARCHAR(100),            -- e.g., "Chrome"
    os VARCHAR(100),                 -- e.g., "MacOS"
    last_active TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE   -- mark if session is still active
);
