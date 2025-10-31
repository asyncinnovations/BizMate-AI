"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoices", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      customer_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      customer_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      payment_terms: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      subtotal: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      vat: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: "draft",
      },
      custom_fields: {
        type: Sequelize.JSONB,
        defaultValue: [],
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invoices");
  },
};
