"use strict";

/**
 * Migration: Update ai_reminders table
 *
 * 1. Adds 4 new columns: source, reference_id, reference_type, ai_prompt
 * 2. Updates the `type` enum to include Invoice, Quotation, Document
 *
 * Safe to run on existing data — all new columns are nullable with defaults.
 */
module.exports = {
  async up(queryInterface, Sequelize) {

    // ── 1. Add source column ──────────────────────────────────────────────
    await queryInterface.addColumn("ai_reminders", "source", {
      type:         Sequelize.ENUM(
        "manual", "ai", "invoice", "quotation", "document", "compliance"
      ),
      allowNull:    false,
      defaultValue: "manual",
    });

    // ── 2. Add reference_id — UUID of linked invoice/quotation/document ───
    await queryInterface.addColumn("ai_reminders", "reference_id", {
      type:      Sequelize.UUID,
      allowNull: true,
    });

    // ── 3. Add reference_type — human label of linked record ──────────────
    await queryInterface.addColumn("ai_reminders", "reference_type", {
      type:      Sequelize.STRING(100),
      allowNull: true,
    });

    // ── 4. Add ai_prompt — stores the original user prompt ────────────────
    await queryInterface.addColumn("ai_reminders", "ai_prompt", {
      type:      Sequelize.TEXT,
      allowNull: true,
    });

    // ── 5. Update the `type` enum to include new types ────────────────────
    // PostgreSQL requires dropping and recreating the enum type.
    await queryInterface.sequelize.query(`
      ALTER TYPE ai_reminders_type_enum
      ADD VALUE IF NOT EXISTS 'Invoice';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE ai_reminders_type_enum
      ADD VALUE IF NOT EXISTS 'Quotation';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE ai_reminders_type_enum
      ADD VALUE IF NOT EXISTS 'Document';
    `);

    // ── 6. Index for fast module-based lookups ────────────────────────────
    await queryInterface.addIndex("ai_reminders", ["reference_id"]);
    await queryInterface.addIndex("ai_reminders", ["source"]);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("ai_reminders", "source");
    await queryInterface.removeColumn("ai_reminders", "reference_id");
    await queryInterface.removeColumn("ai_reminders", "reference_type");
    await queryInterface.removeColumn("ai_reminders", "ai_prompt");
    // Note: PostgreSQL does not support removing enum values without recreating the type
  },
};
