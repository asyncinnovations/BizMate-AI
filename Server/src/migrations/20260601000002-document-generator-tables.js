"use strict";

/**
 * Migration: Document Generator tables
 *
 * 1. Creates generated_documents table — stores all documents created
 *    from templates or by AI, with full status lifecycle + activity log.
 *
 * 2. Adds category and ai_prompt columns to the templates table.
 *
 * Both changes are non-destructive. Existing templates rows are unaffected.
 */
module.exports = {
  async up(queryInterface, Sequelize) {

    // ── 1. Create generated_documents table ──────────────────────────────
    await queryInterface.createTable("generated_documents", {
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
      template_id: {
        type:      Sequelize.UUID,
        allowNull: true,
      },
      document_name: {
        type:      Sequelize.STRING(255),
        allowNull: false,
      },
      category: {
        type:      Sequelize.STRING(100),
        allowNull: true,
      },
      document_type: {
        type:      Sequelize.STRING(100),
        allowNull: true,
      },
      field_values: {
        type:         Sequelize.JSONB,
        allowNull:    false,
        defaultValue: {},
      },
      content: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },
      ai_prompt: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },
      compliance_score: {
        type:      Sequelize.INTEGER,
        allowNull: true,
      },
      compliance_notes: {
        type:         Sequelize.JSONB,
        allowNull:    false,
        defaultValue: [],
      },
      status: {
        type:         Sequelize.STRING(50),
        allowNull:    false,
        defaultValue: "draft",
      },
      source: {
        type:         Sequelize.STRING(50),
        allowNull:    false,
        defaultValue: "template",
      },
      activity_log: {
        type:         Sequelize.JSONB,
        allowNull:    false,
        defaultValue: [],
      },
      pdf_path: {
        type:      Sequelize.STRING(500),
        allowNull: true,
      },
      docx_path: {
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

    // Index for fast user queries
    await queryInterface.addIndex("generated_documents", ["user_id"]);
    await queryInterface.addIndex("generated_documents", ["status"]);
    await queryInterface.addIndex("generated_documents", ["category"]);
    await queryInterface.addIndex("generated_documents", ["created_at"]);

    // ── 2. Add category column to templates ───────────────────────────────
    await queryInterface.addColumn("templates", "category", {
      type:      Sequelize.STRING(100),
      allowNull: true,
    });

    // ── 3. Add ai_prompt column to templates ──────────────────────────────
    await queryInterface.addColumn("templates", "ai_prompt", {
      type:      Sequelize.TEXT,
      allowNull: true,
    });

    // Back-fill category for existing prebuilt templates
    // (Best effort — assign "Legal" as default so templates show under a category)
    await queryInterface.sequelize.query(`
      UPDATE templates
      SET category = CASE
        WHEN LOWER(template_name) LIKE '%nda%'           THEN 'Legal'
        WHEN LOWER(template_name) LIKE '%agreement%'     THEN 'Legal'
        WHEN LOWER(template_name) LIKE '%contract%'      THEN 'Legal'
        WHEN LOWER(template_name) LIKE '%employment%'    THEN 'HR'
        WHEN LOWER(template_name) LIKE '%offer letter%'  THEN 'HR'
        WHEN LOWER(template_name) LIKE '%payroll%'       THEN 'HR'
        WHEN LOWER(template_name) LIKE '%invoice%'       THEN 'Finance'
        WHEN LOWER(template_name) LIKE '%quotation%'     THEN 'Finance'
        WHEN LOWER(template_name) LIKE '%receipt%'       THEN 'Finance'
        WHEN LOWER(template_name) LIKE '%purchase%'      THEN 'Operations'
        WHEN LOWER(template_name) LIKE '%proposal%'      THEN 'Business'
        ELSE 'Business'
      END
      WHERE category IS NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("generated_documents");
    await queryInterface.removeColumn("templates", "category");
    await queryInterface.removeColumn("templates", "ai_prompt");
  },
};
