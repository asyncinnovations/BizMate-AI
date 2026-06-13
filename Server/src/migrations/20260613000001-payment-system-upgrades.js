"use strict";
// src/migrations/20260613000001-payment-system-upgrades.js
// Adds columns needed for real payment processing:
//   subscription_payments.order_ref   — unique order reference passed to gateway
//   subscription_payments.gateway     — which gateway processed payment
//   subscription_payments.currency    — payment currency (AED default)
// Updates PaymentMethod enum to include telr, tap, apple_pay, google_pay, free
// Updates PaymentStatus enum to include refunded

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. Add order_ref column (unique — webhook lookup key)
    await queryInterface.addColumn("subscription_payments", "order_ref", {
      type:      Sequelize.STRING(100),
      allowNull: true,
      unique:    true,
    });

    // 2. Add gateway column
    await queryInterface.addColumn("subscription_payments", "gateway", {
      type:      Sequelize.STRING(50),
      allowNull: true,
    });

    // 3. Add currency column
    await queryInterface.addColumn("subscription_payments", "currency", {
      type:         Sequelize.STRING(10),
      allowNull:    true,
      defaultValue: "AED",
    });

    // 4. Add updated_at column (entity has @UpdateDateColumn)
    await queryInterface.addColumn("subscription_payments", "updated_at", {
      type:         Sequelize.DATE,
      allowNull:    true,
      defaultValue: Sequelize.NOW,
    });

    // 5. Add new payment_method enum values
    // Postgres: ALTER TYPE ... ADD VALUE is irreversible — safe to add only
    const methods = ["telr", "tap", "apple_pay", "google_pay", "free"];
    for (const val of methods) {
      await queryInterface.sequelize.query(
        `DO $$ BEGIN
           IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = '${val}' AND enumtypid = 'payment_method_enum'::regtype) THEN
             ALTER TYPE payment_method_enum ADD VALUE '${val}';
           END IF;
         END $$;`
      ).catch(() => { /* ignore if enum doesn't exist by this name */ });
    }

    // 6. Add refunded status to payment_status enum
    await queryInterface.sequelize.query(
      `DO $$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'refunded' AND enumtypid = 'payment_status_enum'::regtype) THEN
           ALTER TYPE payment_status_enum ADD VALUE 'refunded';
         END IF;
       END $$;`
    ).catch(() => {});

    // 7. Webhooks routing table (track incoming webhook events for audit)
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS payment_webhook_events (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        gateway     VARCHAR(50)  NOT NULL,
        event_type  VARCHAR(100) NOT NULL,
        order_ref   VARCHAR(100),
        payload     JSONB,
        processed   BOOLEAN DEFAULT false,
        created_at  TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_webhook_order_ref ON payment_webhook_events (order_ref);
    `);

    console.log("[migration] Payment system upgrades applied.");
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("subscription_payments", "order_ref");
    await queryInterface.removeColumn("subscription_payments", "gateway");
    await queryInterface.removeColumn("subscription_payments", "currency");
    await queryInterface.removeColumn("subscription_payments", "updated_at");
    await queryInterface.dropTable("payment_webhook_events");
    // Note: cannot remove enum values in Postgres without recreating the type
  },
};
