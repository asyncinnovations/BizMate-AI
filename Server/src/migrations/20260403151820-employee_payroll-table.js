"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employee_payroll", {
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
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING(20),
      },
      emirates_id: {
        type: Sequelize.STRING(255),
        unique: true,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING(100),
      },
      joining_date: {
        type: Sequelize.DATEONLY, // DATEONLY maps to SQL DATE (no time)
        allowNull: false,
      },
      contract_type: {
        type: Sequelize.ENUM(
          "Full_Time",
          "Part_Time",
          "Contract",
          "Internship",
        ),
        defaultValue: "Full_Time",
      },
      basic_salary: {
        type: Sequelize.DECIMAL(15, 2),
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
      bank_name: {
        type: Sequelize.STRING(150),
      },
      iban: {
        type: Sequelize.STRING(23),
        unique: true,
      },
      metadata: {
        type: Sequelize.JSONB,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employee_payroll");
    // Important: Also drop the ENUM type if using PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_employee_payroll_contract_type";',
    );
  },
};
