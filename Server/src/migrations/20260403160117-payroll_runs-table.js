"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payroll_runs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      month: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("draft", "processed", "paid", "cancelled"),
        defaultValue: "draft",
      },
      total_basic: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      total_allowances: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      total_net: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      processed_date: {
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

    await queryInterface.addIndex("payroll_runs", ["user_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payroll_runs");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payroll_runs_status";',
    );
  },
};
