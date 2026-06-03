"use strict";

/**
 * Migration: Create quotations table
 *
 * Creates the full quotations table with all lifecycle, financial,
 * client, and relationship fields.
 *
 * Run: npx sequelize-cli db:migrate
 */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("quotations", {

      uuid: {
        type:         Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey:   true,
        allowNull:    false,
      },

      id: {
        type:          Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:     false,
      },

      user_id: {
        type:      Sequelize.UUID,
        allowNull: false,
      },

      quotation_number: {
        type:      Sequelize.STRING(50),
        allowNull: false,
        unique:    true,
      },

      project_title: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },

      description: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },

      // Client snapshot (stored on quotation for immutability)
      client_id: {
        type:      Sequelize.UUID,
        allowNull: true,
      },

      client_name: {
        type:      Sequelize.STRING(255),
        allowNull: false,
      },

      client_email: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },

      client_address: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },

      client_phone: {
        type:      Sequelize.STRING(50),
        allowNull: true,
      },

      // Financials
      currency: {
        type:         Sequelize.STRING(10),
        allowNull:    false,
        defaultValue: "AED",
      },

      subtotal: {
        type:         Sequelize.DECIMAL(14, 2),
        allowNull:    false,
        defaultValue: 0,
      },

      total_discount: {
        type:         Sequelize.DECIMAL(14, 2),
        allowNull:    false,
        defaultValue: 0,
      },

      total_tax: {
        type:         Sequelize.DECIMAL(14, 2),
        allowNull:    false,
        defaultValue: 0,
      },

      grand_total: {
        type:         Sequelize.DECIMAL(14, 2),
        allowNull:    false,
        defaultValue: 0,
      },

      // Line items stored as JSONB
      line_items: {
        type:         Sequelize.JSONB,
        allowNull:    false,
        defaultValue: [],
      },

      // Dates
      issue_date: {
        type:      Sequelize.DATEONLY,
        allowNull: false,
      },

      expiry_date: {
        type:      Sequelize.DATEONLY,
        allowNull: false,
      },

      terms_and_conditions: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },

      notes: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },

      // AI
      ai_prompt: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },

      // Status lifecycle
      status: {
        type:         Sequelize.STRING(50),
        allowNull:    false,
        defaultValue: "draft",
      },

      source: {
        type:         Sequelize.STRING(50),
        allowNull:    false,
        defaultValue: "manual",
      },

      // Timestamped status transitions
      activity_log: {
        type:         Sequelize.JSONB,
        allowNull:    false,
        defaultValue: [],
      },

      // Client portal
      public_token: {
        type:      Sequelize.STRING(100),
        allowNull: true,
        unique:    true,
      },

      viewed_at: {
        type:      Sequelize.DATE,
        allowNull: true,
      },

      client_action_at: {
        type:      Sequelize.DATE,
        allowNull: true,
      },

      client_comment: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },

      // Traceability
      converted_invoice_id: {
        type:      Sequelize.UUID,
        allowNull: true,
      },

      // Linked docs: [{ document_uuid, document_type, document_name }]
      linked_documents: {
        type:         Sequelize.JSONB,
        allowNull:    false,
        defaultValue: [],
      },

      pdf_path: {
        type:      Sequelize.STRING(500),
        allowNull: true,
      },

      created_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Indexes for common query patterns
    await queryInterface.addIndex("quotations", ["user_id"]);
    await queryInterface.addIndex("quotations", ["status"]);
    await queryInterface.addIndex("quotations", ["client_name"]);
    await queryInterface.addIndex("quotations", ["expiry_date"]);
    await queryInterface.addIndex("quotations", ["created_at"]);
    // public_token already has a unique constraint which creates an index
  },

  async down(queryInterface) {
    await queryInterface.dropTable("quotations");
  },
};
