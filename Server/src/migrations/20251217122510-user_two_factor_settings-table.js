"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_user_two_factor_settings_method" AS ENUM('totp', 'sms', 'email');
    `);

    await queryInterface.createTable("user_two_factor_settings", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true, 
      },
      is_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      method: {
        type: "enum_user_two_factor_settings_method",
        allowNull: false,
      },
      secret: {
        type: Sequelize.STRING(255),
        allowNull: true, // for TOTP secret
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true, // for SMS
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true, // for email OTP
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_two_factor_settings");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_two_factor_settings_method";'
    );
  },
};
