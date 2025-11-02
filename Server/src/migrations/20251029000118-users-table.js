"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
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
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lichence_file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["admin", "business_owner", "team_member"]],
        },
      },
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      license_number: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      license_file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      vat_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING(255),
        validate: {
          isIn: [["freelancer", "sme", "startup"]],
        },
        allowNull: true,
      },
      language_preference: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "en",
        validate: {
          isIn: [["en", "ar", "hi"]],
        },
      },
      status: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: "active",
        validate: {
          isIn: [["active", "inactive", "suspended"]],
        },
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
