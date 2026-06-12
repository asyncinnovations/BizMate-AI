// src/components/legal-modal/legalContent.ts
// Single source of truth for all BizMate AI legal documents.
// Update when legal counsel revises. Version + date tracked per document.

export interface LegalSection { title: string; content: string }

export interface LegalDocument {
  id:            string;
  title:         string;
  subtitle:      string;
  version:       string;
  effectiveDate: string;
  lastUpdated:   string;
  sections:      LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  id: "privacy-policy", title: "Privacy Policy",
  subtitle: "How we collect, use, and protect your data",
  version: "1.2", effectiveDate: "1 October 2024", lastUpdated: "1 June 2026",
  sections: [
    { title: "1. Who We Are", content: "BizMate AI is an AI-powered business operating system developed and operated by Async Innovations FZ-LLC, a company registered in a UAE Free Zone. We are committed to protecting the personal and business data you share with us. Contact: privacy@bizmate.ai." },
    { title: "2. Information We Collect", content: "We collect: registration data (name, email, phone, company name, trade license number, VAT ID); business profile information (industry, services, communication preferences); financial records you create (invoices, quotations, client details); compliance documents you upload for AI summarisation; AI assistant conversation history; and automatically collected technical data (IP address, device type, browser, session duration, feature usage) for security and service improvement." },
    { title: "3. How We Use Your Information", content: "Your data is used to: (a) provide and personalise the BizMate AI platform; (b) generate AI-powered invoices, quotations, documents, and reminders; (c) send compliance deadline alerts and payment reminders; (d) process subscription billing; (e) improve our AI using aggregated, fully anonymised signals only — never your individual business data; (f) comply with UAE legal and regulatory obligations; and (g) send service updates, security alerts, and billing information." },
    { title: "4. AI and Data Processing", content: "BizMate AI uses GPT-4 to power its AI features. When you use AI generation features, your prompts and relevant business context are sent to OpenAI Inc. (USA) for processing under their enterprise data processing agreement, which includes a zero-data-retention commitment for enterprise API customers. We do not use your individual, identifiable business data to train AI models." },
    { title: "5. Data Sharing", content: "We do not sell, rent, or trade your data. We share data only with: (a) sub-processors necessary to operate the platform (cloud hosting, email delivery, payment processing, AI processing), all bound by written data processing agreements; (b) regulatory authorities when required by UAE law; and (c) a successor entity in a merger or acquisition with 30 days advance notice to you." },
    { title: "6. Data Storage and Security", content: "Your data is stored on Hetzner Cloud servers in Germany and Finland (EU; ISO 27001 certified). We apply AES-256 encryption at rest and TLS 1.3 in transit. Administrative access requires MFA and full audit logging. Quarterly security assessments are conducted. We will notify you within 72 hours of any data breach affecting your account." },
    { title: "7. Data Retention", content: "Account data is retained for the subscription term plus 7 years (UAE Commercial Companies Law requirement). Invoices and financial records are retained for a minimum of 5 years. AI conversation history is retained for 12 months then anonymised. You may request deletion of personal data not subject to mandatory retention by emailing privacy@bizmate.ai." },
    { title: "8. Your Rights", content: "Under UAE Federal Decree-Law No. 45 of 2021 (PDPL), you have the right to: access your personal data; correct inaccuracies; request deletion (subject to retention obligations); restrict or object to processing; receive data in a portable format; and withdraw consent at any time. Email privacy@bizmate.ai. We aim to respond within 5 business days." },
    { title: "9. Cookies", content: "We use essential session cookies required for authentication — these cannot be disabled. With your consent, we use analytics cookies to improve the platform. We do not use advertising cookies or share data with ad networks." },
    { title: "10. Changes to This Policy", content: "We will notify you of material changes by email at least 14 days before they take effect. Continued use after the effective date constitutes acceptance." },
    { title: "11. Contact", content: "Privacy enquiries: privacy@bizmate.ai — Async Innovations FZ-LLC, UAE. Complaints may also be filed with the UAE Data Office at uaedataoffice.ae." },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  id: "terms-of-service", title: "Terms of Service",
  subtitle: "The rules governing your use of BizMate AI",
  version: "1.1", effectiveDate: "1 October 2024", lastUpdated: "1 June 2026",
  sections: [
    { title: "1. Acceptance", content: "By creating an account or using BizMate AI, you agree to be legally bound by these Terms of Service and our Privacy Policy. If registering on behalf of a business, you represent that you have full authority to bind that entity. If you do not agree, do not create an account." },
    { title: "2. Description of Service", content: "BizMate AI is a cloud-based SaaS business operating system providing: AI-powered invoice creation and management; quotation generation and client portal; document generator with compliance checking; smart reminders with cross-module AI detection; compliance and licensing tracking; payroll management; business analytics; and an AI business assistant. Features available depend on your active subscription plan." },
    { title: "3. Accounts and Registration", content: "You must provide accurate, current, and complete information during registration, including a valid business email address. You are solely responsible for maintaining the confidentiality of your credentials. Notify us immediately at support@bizmate.ai upon discovering any unauthorised use of your account. Each subscription covers one business entity; multi-business usage requires an Enterprise plan." },
    { title: "4. Subscription and Billing", content: "BizMate AI offers a permanent Free plan (no credit card required) and three paid tiers: Starter (AED 99/month), Growth (AED 249/month), and Enterprise (AED 599/month). Paid subscriptions are billed monthly in AED and renew manually — you will receive an email reminder 7 days before expiry. Downgrading takes effect at the end of the current billing period. No refunds for unused portions, except as required by UAE Consumer Protection Law." },
    { title: "5. Acceptable Use", content: "You agree not to: (a) use BizMate AI for any purpose violating UAE law; (b) create fraudulent invoices, false compliance records, or fabricated documents; (c) attempt to reverse-engineer or extract our AI models or source code; (d) use automated scripts to scrape or abuse the platform; (e) share credentials with individuals outside your licensed business entity; (f) resell access without written permission; or (g) generate content that is defamatory, discriminatory, or harmful. We reserve the right to suspend violating accounts without prior notice." },
    { title: "6. AI-Generated Content — Disclaimer", content: "AI-generated content (invoices, quotations, contracts, compliance summaries) is provided as a starting point to save time. It is NOT a substitute for professional legal, financial, or regulatory advice. You are solely responsible for reviewing, verifying, and approving all AI-generated content before use. AI-generated legal clauses must be reviewed by a qualified UAE lawyer. AI-generated VAT calculations must be verified against current FTA guidelines. Async Innovations accepts no liability for losses arising from use of unverified AI-generated output." },
    { title: "7. Intellectual Property", content: "BizMate AI and all its components are the exclusive property of Async Innovations FZ-LLC. Your subscription grants a limited, non-exclusive, non-transferable licence to use the platform for internal business purposes. Your business data and content remain your property. You grant Async Innovations a limited licence to process your data solely to provide the platform services." },
    { title: "8. Service Availability", content: "We target 99.5% monthly uptime, excluding scheduled maintenance. We provide at least 24 hours advance notice for planned maintenance. Status updates are published at status.bizmate.ai. We are not liable for losses from temporary unavailability beyond what is covered in our Enterprise SLA." },
    { title: "9. Limitation of Liability", content: "To the maximum extent permitted by UAE law, Async Innovations shall not be liable for indirect, incidental, or consequential damages; loss of profits; data loss beyond our backup policy; or losses from use of unverified AI-generated content. Our total aggregate liability in any 12-month period shall not exceed the total subscription fees you paid during that period." },
    { title: "10. Governing Law", content: "These Terms are governed by UAE law. Disputes shall be resolved first through 30 days of good-faith negotiation, then by arbitration under DIAC rules in Dubai, UAE. Either party may seek emergency injunctive relief from a UAE court." },
    { title: "11. Modifications", content: "We will communicate material changes by email at least 14 days before they take effect. Continued use after the effective date constitutes acceptance. You may cancel before the effective date if you disagree." },
  ],
};

export const DATA_PROCESSING_AGREEMENT: LegalDocument = {
  id: "dpa", title: "Data Processing Agreement",
  subtitle: "UAE PDPL and GDPR compliant data processing terms",
  version: "1.0", effectiveDate: "1 October 2024", lastUpdated: "1 June 2026",
  sections: [
    { title: "1. Purpose and Parties", content: "This Data Processing Agreement ('DPA') governs the processing of personal data by Async Innovations FZ-LLC ('Data Processor') on behalf of the BizMate AI registered user or business ('Data Controller'). This DPA forms part of the Terms of Service. In case of conflict on data protection matters, this DPA prevails." },
    { title: "2. Legal Basis", content: "This DPA complies with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and, where applicable, the EU GDPR for data subjects in the EEA. Both parties acknowledge their obligations under these laws and agree to process personal data only as required by applicable legal requirements." },
    { title: "3. Definitions", content: "'Personal Data': information relating to an identified or identifiable natural person. 'Processing': any operation on personal data. 'Data Subject': the individual whose personal data is processed. 'Sub-processor': a third party engaged by Async Innovations to process personal data. 'Controller Instructions': documented instructions given by the Data Controller to Async Innovations for processing." },
    { title: "4. Nature, Purpose, and Duration of Processing", content: "Async Innovations processes personal data solely to: operate and maintain BizMate AI; generate AI-powered documents at your instruction; process billing and payment records; send service notifications; and provide technical support. Processing occurs only on your instructions or as required by law. Processing continues for your subscription term plus mandatory retention periods." },
    { title: "5. Categories of Data and Data Subjects", content: "Data Subjects: your clients (name, email, phone, address, payment details); your team members (name, email, role); your own personal and business information. Data categories: contact and identification data; financial and transactional data; trade license and regulatory data; and personal data in documents you create or upload. You represent that you have a lawful basis for sharing your clients' and team members' data with BizMate AI." },
    { title: "6. Controller Instructions", content: "Async Innovations processes your personal data only on your instructions as expressed through use of the platform and this DPA. We will inform you if we believe an instruction infringes applicable data protection law. We will not process your data for our own purposes beyond what is described in this DPA and our Privacy Policy." },
    { title: "7. Sub-processors", content: "Current sub-processors: Hetzner Cloud GmbH (cloud infrastructure, Germany, EU; ISO 27001); OpenAI Inc. (AI processing, USA; enterprise DPA, zero data retention); transactional email infrastructure; Stripe Inc. (payments, Ireland/USA; PCI-DSS L1). We will provide 30 days advance notice before adding or replacing a sub-processor. You may object within 14 days. Current list: bizmate.ai/sub-processors." },
    { title: "8. Data Subject Rights Assistance", content: "You are primarily responsible for responding to data subject rights requests. When fulfilling a request requires action from us, we will provide technical assistance within 72 hours of your written request. We will refer any data subject rights request we receive directly to you without acting on it unless instructed." },
    { title: "9. Security Measures", content: "We maintain: AES-256 encryption at rest; TLS 1.3 in transit; role-based access with least privilege principle; MFA for administrative access; comprehensive audit logging; automated intrusion detection; regular vulnerability assessments and annual penetration testing; documented incident response; and employee security training. We will notify you of any personal data breach within 72 hours of becoming aware." },
    { title: "10. International Data Transfers", content: "Personal data may be transferred outside UAE for AI processing (OpenAI, USA) and server operations (Hetzner, Germany/EU). All transfers use appropriate mechanisms including EU Standard Contractual Clauses. Copies of applicable transfer mechanisms are available on request." },
    { title: "11. Audit Rights", content: "You have the right to audit compliance with this DPA once per calendar year with 30 days advance written notice, a signed confidentiality agreement, and agreement to bear audit costs unless material non-compliance is found. In lieu of direct audit, we will provide security certifications and third-party audit reports on request." },
    { title: "12. Return and Deletion of Data", content: "Upon subscription termination, within 30 days of your written request, we will either return all personal data in a structured, machine-readable format or securely delete it. Data subject to mandatory legal retention will be held in restricted encrypted storage until the retention period expires. We will confirm deletion in writing." },
    { title: "13. Contact", content: "Data protection and DPA enquiries: dpa@bizmate.ai — Async Innovations FZ-LLC, UAE. Response targets: 5 business days for general enquiries; 72 hours for breach notifications and urgent data subject rights requests." },
  ],
};

export const LEGAL_DOCUMENTS = [PRIVACY_POLICY, TERMS_OF_SERVICE, DATA_PROCESSING_AGREEMENT];

export type LegalDocId = "privacy-policy" | "terms-of-service" | "dpa";

export function getLegalDocument(id: LegalDocId): LegalDocument | null {
  return LEGAL_DOCUMENTS.find((d) => d.id === id) ?? null;
}
