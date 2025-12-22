"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
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
      },

      company_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      reminder_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      document_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      notification_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "pending",
      },

      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("notifications");
  },
};
