import { DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_business_info", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      business_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      owner_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      business_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      services_offered: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      communication_channels: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: ["Email", "WhatsApp", "Instagram"],
      },
      availability: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      faq: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      tone_examples: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      snapshot: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_business_info");
  },
};
