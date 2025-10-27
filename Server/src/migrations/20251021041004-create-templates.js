"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("templates", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      template_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fields_schema: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      is_prebuilt: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("templates");
  },
};
