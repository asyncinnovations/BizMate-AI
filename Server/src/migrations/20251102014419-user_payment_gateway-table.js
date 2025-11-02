"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_payment_gateways", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: "gen_random_uuid()",
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      gateway_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      credentials: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    //  unique constraint (one gateway type per user)
    await queryInterface.addConstraint("user_payment_gateways", {
      fields: ["user_id", "gateway_name"],
      type: "unique",
      name: "unique_user_gateway",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_payment_gateways");
  },
};
