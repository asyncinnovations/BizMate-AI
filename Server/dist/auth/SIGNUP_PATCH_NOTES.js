"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGNUP_PATCH_NOTES = void 0;
exports.SIGNUP_PATCH_NOTES = `
WHAT TO DO:
1. Open server/src/auth/auth.controller.ts
2. Import UserBusinessInfoService from user_business_info
3. Add it to constructor injection
4. After signup_service call, add the create_business_info block above
5. Run the migration 20260612000001-add-compliance-fields-to-business-info.js

WHY: The register form (Step 3 for Startup/SME) collects business_location 
(free_zone/mainland) and sends it in the POST /auth/signup body. The current 
signup handler discards it. This patch saves it to user_business_info so 
the Compliance & Legal tab can read the pre-filled value on first login.
`;
//# sourceMappingURL=SIGNUP_PATCH_NOTES.js.map