"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("template_fields", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      field_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      field_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      field_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("template_fields");
  },
};
