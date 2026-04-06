"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ai_documents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      file_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      file_size: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      raw_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parsed_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "processed", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      storage_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes for faster queries
    await queryInterface.addIndex("ai_documents", ["user_id"], {
      name: "idx_ai_documents_user_id",
    });
    await queryInterface.addIndex("ai_documents", ["uploaded_at"], {
      name: "idx_ai_documents_uploaded_at",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table and ENUM type
    await queryInterface.dropTable("ai_documents");
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_ai_documents_status;",
    );
  },
};
