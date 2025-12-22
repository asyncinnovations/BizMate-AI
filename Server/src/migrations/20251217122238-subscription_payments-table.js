"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.sequelize.query(`
    //   CREATE TYPE "enum_subscription_payments_payment_method" AS ENUM('stripe', 'paypal', 'card');
    // `);

    // await queryInterface.sequelize.query(`
    //   CREATE TYPE "enum_subscription_payments_payment_status" AS ENUM('pending', 'completed', 'failed');
    // `);

    await queryInterface.createTable("subscription_payments", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      payment_method: {
        type: "enum_subscription_payments_payment_method",
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: "enum_subscription_payments_payment_status",
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("subscription_payments");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_subscription_payments_payment_method";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_subscription_payments_payment_status";'
    );
  },
};
