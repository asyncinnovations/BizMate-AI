// PATCH INSTRUCTIONS — server/src/auth/auth.controller.ts
//
// The signup handler receives business_location from the register form
// (Step 3 for Startup/SME business types) but never stores it.
// Apply this patch to the existing POST /auth/signup handler.
//
// ── CHANGE 1: In post_data object, capture business_location ────────────────
// Add this to the post_data object inside the signup handler:
//
//   business_location: data.business_location ?? null,
//
// HOWEVER — user entity has no business_location column. The correct approach
// is to create a user_business_info record right after user creation if
// business_location, company_name, or license_number are provided.
//
// ── CHANGE 2: After creating the user, create business_info if data exists ──
//
// Add after the response = await this.authService.signup_service(post_data); line:

/*
if (response?.user_id && (data.business_location || data.company_name || data.license_number)) {
  try {
    await this.userBusinessInfoService.create_business_info_serivce({
      user_id:              response.user_id,
      business_name:        data.company_name || data.full_name + "'s Business",
      industry:             data.industry || data.idustry || "other",
      services_offered:     "To be updated",
      business_location:    data.business_location ?? null,
      compliance_framework: data.business_location === "free_zone" ? "free_zone"
                            : data.business_location === "offshore" ? "offshore"
                            : "mainland",
      business_region:      data.country === "SA" ? "saudi"
                            : data.country === "QA" ? "qatar"
                            : data.country === "KW" ? "kuwait"
                            : data.country === "BH" ? "bahrain"
                            : data.country === "OM" ? "oman"
                            : "uae",
      trade_license_number: data.license_number ?? null,
      trn:                  data.vat_id ?? null,
      currency:             "AED",
      is_active:            true,
    });
  } catch (e) {
    // Non-fatal — user is created; business info can be completed from profile
    console.error("[signup] Failed to pre-create business info:", e);
  }
}
*/

// ── CHANGE 3: Inject UserBusinessInfoService in the controller constructor ──
// The controller already injects AuthService and SubscriptionPlanService.
// Add UserBusinessInfoService:
//
//   constructor(
//     private readonly authService: AuthService,
//     private readonly planService: SubscriptionPlanService,
//     private readonly userBusinessInfoService: UserBusinessInfoService,  // ADD THIS
//   ) {}
//
// And import at the top of the file:
//   import { UserBusinessInfoService } from 'src/user_business_info/user_business_info.service';
//
// And add UserBusinessInfoService to AuthModule providers array.

export const SIGNUP_PATCH_NOTES = `
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
