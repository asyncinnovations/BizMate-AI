"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ai_reminders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM("VAT", "License", "Payroll", "Custom"),
        allowNull: false,
      },
      notified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      reminder_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      notify_before: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 3, // 3 days before
        comment: "Number of days before reminder_date to notify user",
      },
      notify_channels: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: { email: true, whatsapp: false, push: true },
      },
      recurrence_rule: {
        type: Sequelize.ENUM("none", "monthly", "quarterly", "yearly"),
        allowNull: false,
        defaultValue: "none",
      },
      status: {
        type: Sequelize.ENUM("pending", "sent", "completed", "missed"),
        allowNull: false,
        defaultValue: "pending",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop ENUMs first to prevent Postgres constraint errors
    await queryInterface.dropTable("reminders");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reminders_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reminders_recurrence_rule";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reminders_status";'
    );
  },
};
