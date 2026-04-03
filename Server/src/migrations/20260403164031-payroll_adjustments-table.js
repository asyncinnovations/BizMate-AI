"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payroll_adjustments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      payroll_run_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      employee_payroll_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: false,
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

    // Composite index for optimized queries when calculating employee totals for a run
    await queryInterface.addIndex("payroll_adjustments", [
      "payroll_run_id",
      "employee_payroll_id",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payroll_adjustments");
  },
};
