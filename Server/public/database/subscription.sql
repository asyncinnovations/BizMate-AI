-- Create Enum Types
CREATE TYPE plan_name_enum AS ENUM ('Trial', 'Starter', 'Standard', 'Premium');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE payment_method_enum AS ENUM ('stripe', 'paypal', 'card');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed');

-- Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name plan_name_enum NOT NULL,
    description TEXT,
    features JSONB NULL,
    price NUMERIC(10,2) NOT NULL,
    duration_days INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

--User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP NOT NULL,
    status subscription_status_enum DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

--  Subscription Payments
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_subscription_id UUID NOT NULL,
    payment_method payment_method_enum NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_status payment_status_enum NOT NULL,
    transaction_id VARCHAR(100),   -- provider txn id
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE
);
CREATE TABLE subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL,
  usage_key TEXT NOT NULL, 
  -- e.g. 'email_send', 'api_call', 'ai_prompt', 'whatsapp_send'
  used INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP NOT NULL,
  period_end   TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_subscription_usage
    UNIQUE (subscription_id, usage_key, period_start),
  CONSTRAINT chk_usage_positive
    CHECK (used >= 0)
);
CREATE TABLE subscription_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL,
  usage_key TEXT NOT NULL,
  amount INTEGER DEFAULT 1,
  source TEXT, -- api, email, cron, ai
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
