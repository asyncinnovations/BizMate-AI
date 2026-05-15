"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoice_schedules", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      invoice_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      recipient_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM("one_time", "monthly", "weekly", "daily"),
        allowNull: false,
        defaultValue: "one_time",
      },

      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "pending",
          "processing",
          "sent",
          "failed",
          "cancelled",
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      last_error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // indexes (important for cron queries)
    await queryInterface.addIndex("invoice_schedules", ["scheduled_at"]);
    await queryInterface.addIndex("invoice_schedules", ["status"]);
    await queryInterface.addIndex("invoice_schedules", ["invoice_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invoice_schedules");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_invoice_schedules_type";',
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_invoice_schedules_status";',
    );
  },
};
