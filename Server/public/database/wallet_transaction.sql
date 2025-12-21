CREATE TABLE wallet_transaction (
    id  int autoincreament,
    uuid uuid primary key
    user_id             BIGINT NOT NULL,              -- Reference to users table
    transaction_type    ENUM('credit', 'debit', 'subscription_purchase', 'refund') NOT NULL,
    amount              DECIMAL(12,2) NOT NULL,       -- Transaction amount
    currency            VARCHAR(10) DEFAULT 'USD',    -- Currency code
    payment_method      VARCHAR(50),                  -- e.g., card, wallet balance, PayPal
    subscription_id     BIGINT NULL,                  -- Link to subscription table if applicable
    status              ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    reference_no        VARCHAR(100),                 -- External payment gateway reference
    description         VARCHAR(255),                 -- Notes about the transaction
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);