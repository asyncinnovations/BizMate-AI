"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("client_lists", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      whatsapp_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      instagram_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      added_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // Add unique constraints
    await queryInterface.addConstraint("client_lists", {
      fields: ["user_id", "email"],
      type: "unique",
      name: "unique_user_email",
    });

    await queryInterface.addConstraint("client_lists", {
      fields: ["user_id", "whatsapp_number"],
      type: "unique",
      name: "unique_user_whatsapp",
    });

    await queryInterface.addConstraint("client_lists", {
      fields: ["user_id", "instagram_id"],
      type: "unique",
      name: "unique_user_instagram",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("client_lists");
  },
};
