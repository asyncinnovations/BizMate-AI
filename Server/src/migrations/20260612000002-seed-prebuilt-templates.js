"use strict";
// src/migrations/20260612000002-seed-prebuilt-templates.js
//
// Seeds 10 pre-built templates into the templates table.
// These are the templates users see on the Document Generator dashboard.
// Without this seed, the platform template grid is empty on every new install.
//
// Run: npx sequelize-cli db:migrate
// Safe to run multiple times — uses INSERT ... WHERE NOT EXISTS on template_name.

const TEMPLATES = [
  // ── LEGAL ─────────────────────────────────────────────────────────────────
  {
    template_name: "Non-Disclosure Agreement (NDA)",
    description:   "Protect confidential business information shared between two UAE parties. Covers DIFC and mainland jurisdiction options.",
    category:      "Legal",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        effectiveDate:          { label: "Effective Date",          type: "date",   required: true  },
        disclosingParty:        { label: "Disclosing Party Name",   type: "text",   required: true  },
        disclosingPartyAddress: { label: "Disclosing Party Address",type: "text",   required: true  },
        receivingParty:         { label: "Receiving Party Name",    type: "text",   required: true  },
        receivingPartyAddress:  { label: "Receiving Party Address", type: "text",   required: true  },
      },
      main: {
        purpose:             { label: "Purpose of Disclosure",    type: "textarea", required: true  },
        confidentialInfo:    { label: "Confidential Information", type: "textarea", required: false },
        agreementDuration:   { label: "Duration (e.g. 2 years)",  type: "text",    required: true  },
        governingLaw:        { label: "Governing Law",            type: "select",  required: true,
                               options: ["UAE — Mainland", "UAE — DIFC", "UAE — ADGM", "UAE — RAK ICC"] },
      },
      footer: {
        disclosingSignatory: { label: "Disclosing Signatory Name", type: "text", required: true },
        receivingSignatory:  { label: "Receiving Signatory Name",  type: "text", required: true },
        signatureDate:       { label: "Signature Date",            type: "date", required: true },
      },
    }),
  },
  {
    template_name: "Service Agreement",
    description:   "Define the scope, deliverables, payment terms and governing law for B2B service engagements.",
    category:      "Legal",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        serviceProviderName:    { label: "Service Provider Name",    type: "text", required: true  },
        serviceProviderAddress: { label: "Service Provider Address", type: "text", required: true  },
        clientName:             { label: "Client / Company Name",    type: "text", required: true  },
        clientAddress:          { label: "Client Address",           type: "text", required: true  },
        agreementDate:          { label: "Agreement Date",           type: "date", required: true  },
      },
      main: {
        servicesDescription: { label: "Services Description",          type: "textarea", required: true  },
        deliverables:        { label: "Deliverables",                  type: "textarea", required: true  },
        projectTimeline:     { label: "Project Timeline",             type: "text",     required: true  },
        totalFee:            { label: "Total Fee (AED)",              type: "number",   required: true  },
        paymentTerms:        { label: "Payment Terms",                type: "text",     required: true,
                               placeholder: "e.g. 50% upfront, 50% on delivery" },
        governingLaw:        { label: "Governing Law",                type: "select",   required: true,
                               options: ["UAE — Mainland", "UAE — DIFC", "UAE — ADGM"] },
      },
      footer: {
        providerSignatoryName: { label: "Provider Signatory", type: "text", required: true },
        clientSignatoryName:   { label: "Client Signatory",   type: "text", required: true },
        signatureDate:         { label: "Signature Date",     type: "date", required: true },
      },
    }),
  },
  {
    template_name: "Freelancer / Contractor Agreement",
    description:   "Engage a freelancer or independent contractor with clear IP ownership, payment, and termination clauses.",
    category:      "Legal",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        clientName:       { label: "Client / Company Name",     type: "text", required: true },
        clientAddress:    { label: "Client Address",            type: "text", required: true },
        freelancerName:   { label: "Freelancer / Contractor",   type: "text", required: true },
        freelancerEmirate:{ label: "Emirate of Freelancer",     type: "select", required: true,
                            options: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"] },
        startDate:        { label: "Start Date",                type: "date", required: true },
        endDate:          { label: "End Date (or Ongoing)",     type: "text", required: false },
      },
      main: {
        scopeOfWork:      { label: "Scope of Work",             type: "textarea", required: true },
        rateOrFixed:      { label: "Rate (hourly/fixed)",       type: "text",     required: true },
        paymentSchedule:  { label: "Payment Schedule",          type: "text",     required: true,
                            placeholder: "e.g. Monthly on the 30th" },
        ipOwnership:      { label: "IP Ownership",             type: "select",   required: true,
                            options: ["Belongs to Client", "Shared", "Belongs to Freelancer"] },
        noticePeriod:     { label: "Notice Period",            type: "text",     required: false },
      },
      footer: {
        clientSignatory:     { label: "Client Signatory",     type: "text", required: true },
        freelancerSignatory: { label: "Freelancer Signature", type: "text", required: true },
        signatureDate:       { label: "Date Signed",          type: "date", required: true },
      },
    }),
  },

  // ── HR ────────────────────────────────────────────────────────────────────
  {
    template_name: "Employment Contract",
    description:   "UAE Labour Law (2022) compliant employment contract with probation, leave, end-of-service gratuity, and WPS clauses.",
    category:      "HR",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        employerName:    { label: "Employer Company Name",    type: "text", required: true },
        employerAddress: { label: "Employer Address",         type: "text", required: true },
        employeeName:    { label: "Employee Full Name",       type: "text", required: true },
        employeeNationality: { label: "Employee Nationality", type: "text", required: true },
        jobTitle:        { label: "Job Title",                type: "text", required: true },
        department:      { label: "Department",               type: "text", required: false },
        startDate:       { label: "Employment Start Date",    type: "date", required: true },
        contractType:    { label: "Contract Type",            type: "select", required: true,
                           options: ["Fixed-Term", "Unlimited"] },
      },
      main: {
        basicSalary:     { label: "Basic Salary (AED/month)",  type: "number", required: true },
        allowances:      { label: "Allowances (AED)",         type: "text",   required: false,
                           placeholder: "e.g. Housing: 2,000 / Transport: 500" },
        probationPeriod: { label: "Probation Period",         type: "select", required: true,
                           options: ["3 months", "6 months"] },
        annualLeave:     { label: "Annual Leave (days)",      type: "number", required: true },
        workLocation:    { label: "Primary Work Location",    type: "text",   required: true },
        workingHours:    { label: "Working Hours/Week",       type: "text",   required: true,
                           placeholder: "e.g. 48 hours / 5 days" },
      },
      footer: {
        employerSignatory: { label: "Employer Signatory",  type: "text", required: true },
        employeeSignatory: { label: "Employee Signature",  type: "text", required: true },
        signatureDate:     { label: "Date Signed",         type: "date", required: true },
      },
    }),
  },
  {
    template_name: "Job Offer Letter",
    description:   "Formal offer letter including role, salary, start date, and conditions for UAE-based roles.",
    category:      "HR",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        companyName:    { label: "Company Name",     type: "text", required: true },
        companyAddress: { label: "Company Address",  type: "text", required: true },
        candidateName:  { label: "Candidate Name",   type: "text", required: true },
        issueDate:      { label: "Offer Issue Date", type: "date", required: true },
      },
      main: {
        jobTitle:        { label: "Job Title",              type: "text",   required: true },
        reportingTo:     { label: "Reporting To",           type: "text",   required: false },
        offeredSalary:   { label: "Offered Salary (AED)",   type: "number", required: true },
        startDate:       { label: "Proposed Start Date",    type: "date",   required: true },
        offerExpiry:     { label: "Offer Expiry Date",      type: "date",   required: true },
        conditions:      { label: "Special Conditions",     type: "textarea", required: false,
                           placeholder: "e.g. Subject to visa approval, background check" },
      },
      footer: {
        signatoryName:   { label: "Authorised Signatory", type: "text", required: true },
        signatoryTitle:  { label: "Signatory Title",      type: "text", required: false },
        signatureDate:   { label: "Date",                 type: "date", required: true },
      },
    }),
  },
  {
    template_name: "Employment Termination Letter",
    description:   "Formal termination of employment with notice period and end-of-service entitlement language (UAE Labour Law compliant).",
    category:      "HR",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        companyName:     { label: "Company Name",         type: "text", required: true },
        employeeName:    { label: "Employee Full Name",   type: "text", required: true },
        employeeId:      { label: "Employee ID / File No",type: "text", required: false },
        terminationDate: { label: "Termination Date",     type: "date", required: true },
      },
      main: {
        terminationReason: { label: "Reason for Termination", type: "textarea", required: false,
                             placeholder: "Optional — leave blank if confidential" },
        noticePeriod:      { label: "Notice Period",          type: "text",     required: true,
                             placeholder: "e.g. 30 days from date of this letter" },
        lastWorkingDay:    { label: "Last Working Day",       type: "date",     required: true },
        eosb:              { label: "EOSB / Gratuity Note",  type: "textarea", required: false,
                             placeholder: "e.g. EOSB will be calculated per UAE Labour Law and processed within 2 weeks" },
      },
      footer: {
        hrSignatoryName:  { label: "HR / Manager Name",      type: "text", required: true },
        hrSignatoryTitle: { label: "Title",                  type: "text", required: true },
        signatureDate:    { label: "Date",                   type: "date", required: true },
      },
    }),
  },

  // ── FINANCE ───────────────────────────────────────────────────────────────
  {
    template_name: "Business Proposal",
    description:   "Professional business proposal covering the problem, solution, deliverables, pricing, and timeline for UAE clients.",
    category:      "Finance",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        proposalTitle:  { label: "Proposal Title",        type: "text", required: true },
        proposedBy:     { label: "Proposed By (Company)", type: "text", required: true },
        proposedTo:     { label: "Proposed To (Company)", type: "text", required: true },
        proposalDate:   { label: "Proposal Date",         type: "date", required: true },
        validUntil:     { label: "Valid Until",           type: "date", required: true },
      },
      main: {
        executiveSummary:  { label: "Executive Summary",    type: "textarea", required: true },
        problemStatement:  { label: "Problem / Opportunity",type: "textarea", required: true },
        proposedSolution:  { label: "Proposed Solution",    type: "textarea", required: true },
        deliverables:      { label: "Deliverables",         type: "textarea", required: true },
        timeline:          { label: "Timeline",             type: "text",     required: true },
        investmentTotal:   { label: "Investment Total (AED)",type: "number",  required: true },
        paymentTerms:      { label: "Payment Terms",        type: "text",     required: true },
        whyUs:             { label: "Why Choose Us",        type: "textarea", required: false },
      },
      footer: {
        contactName:   { label: "Contact Name",  type: "text", required: true },
        contactEmail:  { label: "Contact Email", type: "text", required: true },
        contactPhone:  { label: "Contact Phone", type: "text", required: false },
      },
    }),
  },
  {
    template_name: "Payment Receipt",
    description:   "Simple payment receipt for goods or services rendered. Includes VAT reference fields.",
    category:      "Finance",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        receiptNumber:  { label: "Receipt Number",      type: "text",   required: true },
        receiptDate:    { label: "Receipt Date",        type: "date",   required: true },
        companyName:    { label: "Issuing Company",     type: "text",   required: true },
        companyTRN:     { label: "Company TRN",         type: "text",   required: false },
        paidByName:     { label: "Paid By (Name)",      type: "text",   required: true },
      },
      main: {
        description:   { label: "Description of Payment", type: "textarea", required: true },
        subtotal:      { label: "Subtotal (AED)",          type: "number",   required: true },
        vatRate:       { label: "VAT Rate",               type: "select",   required: true,
                         options: ["5% (Standard)", "0% (Zero-rated)", "Exempt"] },
        vatAmount:     { label: "VAT Amount (AED)",        type: "number",   required: false },
        totalAmount:   { label: "Total Amount (AED)",      type: "number",   required: true },
        paymentMethod: { label: "Payment Method",         type: "select",   required: true,
                         options: ["Bank Transfer", "Cheque", "Cash", "Card", "Online"] },
      },
      footer: {
        authorisedBy:  { label: "Authorised By", type: "text", required: true },
        signatureDate: { label: "Date",          type: "date", required: true },
      },
    }),
  },

  // ── OPERATIONS ────────────────────────────────────────────────────────────
  {
    template_name: "Meeting Minutes",
    description:   "Record decisions, action items and attendees from board or team meetings.",
    category:      "Operations",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        meetingTitle:  { label: "Meeting Title",        type: "text", required: true },
        meetingDate:   { label: "Meeting Date",         type: "date", required: true },
        meetingTime:   { label: "Meeting Time",         type: "text", required: true },
        location:      { label: "Location / Platform",  type: "text", required: true },
        chairperson:   { label: "Chairperson",          type: "text", required: true },
        attendees:     { label: "Attendees",            type: "textarea", required: true,
                         placeholder: "One name per line or comma-separated" },
      },
      main: {
        agenda:        { label: "Agenda Items",          type: "textarea", required: true  },
        discussion:    { label: "Discussion Notes",      type: "textarea", required: true  },
        decisions:     { label: "Decisions Made",        type: "textarea", required: true  },
        actionItems:   { label: "Action Items & Owners", type: "textarea", required: false,
                         placeholder: "Action | Owner | Due Date" },
        nextMeeting:   { label: "Next Meeting Date",     type: "date",     required: false },
      },
      footer: {
        minutesTakenBy: { label: "Minutes Taken By", type: "text", required: true },
        approvedBy:     { label: "Approved By",       type: "text", required: true },
        signatureDate:  { label: "Date",              type: "date", required: true },
      },
    }),
  },
  {
    template_name: "Vendor / Supplier Agreement",
    description:   "Formalise procurement terms with a UAE supplier including pricing, delivery, quality, and dispute resolution.",
    category:      "Operations",
    is_prebuilt:   true,
    fields_schema: JSON.stringify({
      header: {
        buyerName:      { label: "Buyer Company Name",  type: "text", required: true },
        buyerAddress:   { label: "Buyer Address",       type: "text", required: true },
        vendorName:     { label: "Vendor / Supplier",   type: "text", required: true },
        vendorAddress:  { label: "Vendor Address",      type: "text", required: true },
        agreementDate:  { label: "Agreement Date",      type: "date", required: true },
      },
      main: {
        goodsOrServices: { label: "Goods / Services",       type: "textarea", required: true  },
        pricing:         { label: "Pricing Terms",          type: "textarea", required: true  },
        deliveryTerms:   { label: "Delivery Terms & Lead Time", type: "text", required: true  },
        paymentTerms:    { label: "Payment Terms",          type: "text",     required: true  },
        qualityStandards:{ label: "Quality Standards",      type: "textarea", required: false },
        termAndRenewal:  { label: "Contract Term & Renewal",type: "text",     required: true  },
        disputeResolution:{ label: "Dispute Resolution",    type: "select",   required: true,
                            options: ["UAE Courts", "DIAC Arbitration", "ADCCAC", "Mutual Negotiation first"] },
      },
      footer: {
        buyerSignatory:  { label: "Buyer Signatory",  type: "text", required: true },
        vendorSignatory: { label: "Vendor Signatory", type: "text", required: true },
        signatureDate:   { label: "Date Signed",      type: "date", required: true },
      },
    }),
  },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date().toISOString();

    for (const tmpl of TEMPLATES) {
      // Only insert if template_name does not already exist — idempotent
      await queryInterface.sequelize.query(
        `INSERT INTO templates (
           uuid, template_name, description, category,
           fields_schema, is_prebuilt, is_active, version,
           created_at, updated_at
         )
         SELECT
           gen_random_uuid(), :name, :desc, :cat,
           :schema::jsonb, true, true, 1,
           :now, :now
         WHERE NOT EXISTS (
           SELECT 1 FROM templates WHERE template_name = :name
         )`,
        {
          replacements: {
            name:   tmpl.template_name,
            desc:   tmpl.description,
            cat:    tmpl.category,
            schema: tmpl.fields_schema,
            now,
          },
          type: queryInterface.sequelize.QueryTypes.INSERT,
        }
      );
    }

    console.log(`[migration] ${TEMPLATES.length} pre-built templates seeded.`);
  },

  async down(queryInterface) {
    const names = TEMPLATES.map((t) => t.template_name);
    await queryInterface.sequelize.query(
      `DELETE FROM templates WHERE template_name IN (:names) AND is_prebuilt = true`,
      { replacements: { names }, type: queryInterface.sequelize.QueryTypes.DELETE }
    );
    console.log(`[migration] Pre-built templates removed.`);
  },
};
