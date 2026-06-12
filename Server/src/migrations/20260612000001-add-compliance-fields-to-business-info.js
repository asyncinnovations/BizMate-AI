"use strict";
// src/migrations/20260612000001-add-compliance-fields-to-business-info.js
//
// Adds 6 new nullable columns to user_business_info:
//   business_location    VARCHAR(50)  — captured at signup (free_zone/mainland/offshore)
//   compliance_framework VARCHAR(50)  — set in Compliance & Legal tab
//   business_region      VARCHAR(20)  — GCC country (uae/saudi/qatar etc.)
//   trade_license_number VARCHAR(100) — from business profile form
//   trn                  VARCHAR(50)  — Tax Registration Number
//   address              TEXT         — business address
//   currency             VARCHAR(10)  — default invoice currency (AED/USD/etc.)
//
// All columns are nullable with sensible defaults — safe to run on live data.

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("user_business_info", "business_location", {
      type:         Sequelize.STRING(50),
      allowNull:    true,
      defaultValue: null,
      comment:      "free_zone | mainland | offshore — collected at signup",
    });

    await queryInterface.addColumn("user_business_info", "compliance_framework", {
      type:         Sequelize.STRING(50),
      allowNull:    true,
      defaultValue: null,
      comment:      "mainland | free_zone | offshore — set in Compliance tab",
    });

    await queryInterface.addColumn("user_business_info", "business_region", {
      type:         Sequelize.STRING(20),
      allowNull:    true,
      defaultValue: "uae",
      comment:      "GCC country: uae | saudi | qatar | kuwait | bahrain | oman",
    });

    await queryInterface.addColumn("user_business_info", "trade_license_number", {
      type:         Sequelize.STRING(100),
      allowNull:    true,
      defaultValue: null,
    });

    await queryInterface.addColumn("user_business_info", "trn", {
      type:         Sequelize.STRING(50),
      allowNull:    true,
      defaultValue: null,
      comment:      "UAE Tax Registration Number",
    });

    await queryInterface.addColumn("user_business_info", "address", {
      type:         Sequelize.TEXT,
      allowNull:    true,
      defaultValue: null,
    });

    await queryInterface.addColumn("user_business_info", "currency", {
      type:         Sequelize.STRING(10),
      allowNull:    true,
      defaultValue: "AED",
    });

    // Backfill: any existing rows that came from the signup form
    // will have business_location set via the auth.signup handler
    // (business_location is already sent in formData but not yet stored).
    // We cannot backfill without app logic — leave as null.

    console.log("[migration] user_business_info: 7 new columns added.");
  },

  async down(queryInterface) {
    for (const col of [
      "business_location", "compliance_framework", "business_region",
      "trade_license_number", "trn", "address", "currency",
    ]) {
      await queryInterface.removeColumn("user_business_info", col);
    }
  },
};
