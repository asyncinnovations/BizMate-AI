import { DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.createTable("user_integrations", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },

      uuid: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      platform: {
        type: DataTypes.ENUM("email", "whatsapp", "instagram"),
        allowNull: false,
      },

      access_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      last_sync_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("connected", "disconnected"),
        defaultValue: "disconnected",
      },

      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_integrations");

    // 🧹 Drop ENUM types explicitly to avoid leftover ENUMs in PostgreSQL
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_user_integrations_platform";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_user_integrations_status";`
    );
  },
};
