"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payroll_run_items", {
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
        allowNull: true, // Nullable in case employee is deleted from master but stays in history
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      iban: {
        type: Sequelize.STRING(23),
        allowNull: true,
      },
      basic_salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      housing_allowance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      transport_allowance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      other_allowance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      total_adjustments: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      net_salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Indexes for high-performance lookups
    await queryInterface.addIndex("payroll_run_items", ["payroll_run_id"]);
    await queryInterface.addIndex("payroll_run_items", ["employee_payroll_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payroll_run_items");
  },
};
