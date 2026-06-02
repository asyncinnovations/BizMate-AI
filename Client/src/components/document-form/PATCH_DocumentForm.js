// ═══════════════════════════════════════════════════════════════════════════
// PATCH GUIDE FOR: src/components/document-form/DocumentForm.tsx
//
// Apply 4 targeted changes to this file.
// All other code stays exactly as-is.
// ═══════════════════════════════════════════════════════════════════════════

// ── PATCH 1 — Add new imports at the top (after existing imports) ───────────
//
// ADD after the last existing import line:
//
//   import { useAiTemplateGenerator } from "@/hooks/useDocumentAI";
//   import { Brain, Zap }             from "lucide-react";   // Brain already in lucide - check existing
//


// ── PATCH 2 — Add hook inside the component (after existing useState lines) ─
//
// FIND this line inside DocumentForm():
//   const { enforceAndIncrement } = useSubscriptionGuard();
//
// ADD immediately after:
//
//   // Real AI template generator — replaces the hardcoded setTimeout
//   const { generate: generateAiTemplate, isGenerating: isAiGenerating } = useAiTemplateGenerator();
//


// ── PATCH 3 — Replace fetchAIGeneratedFields with real API call ─────────────
//
// FIND and REPLACE the entire fetchAIGeneratedFields function:
//
// ORIGINAL (hardcoded — always returns Name + Email regardless of prompt):
//   const fetchAIGeneratedFields = async () => {
//     try {
//       setIsGenerating(true);
//       const response: FieldConfig[] = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const aiResponseFields: FieldConfig[] = [
//             { id: "temp-1", field_name: "Name",  field_type: "text",  placeholder: "Enter your name",           required: false },
//             { id: "temp-2", field_name: "Email", field_type: "email", placeholder: "Enter your business email", required: true  },
//           ];
//           setTemplateName(promptFromUrl.slice(0, 30));
//           setTemplateDescription(promptFromUrl);
//           resolve(aiResponseFields);
//         }, 2000);
//       });
//       const aiResponseFieldsWithUniqueIds = response.map((f) => ({ ...f, unique_id: generateUniqueId() }));
//       setFields(aiResponseFieldsWithUniqueIds);
//       setOriginalFields(aiResponseFieldsWithUniqueIds);
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to generate AI Template");
//     } finally {
//       setIsGenerating(false);
//     }
//   };
//
// REPLACE WITH:
//
//   const fetchAIGeneratedFields = async () => {
//     if (!promptFromUrl.trim()) return;
//     setIsGenerating(true);
//     try {
//       const userId = !loading ? user?.user?.user_id : null;
//
//       // Call POST /templates/ai-generate — returns { template, fields[] }
//       const result = await generateAiTemplate(
//         userId,
//         promptFromUrl,
//         promptFromUrl.slice(0, 50),
//       );
//
//       if (result?.fields && Array.isArray(result.fields)) {
//         const withUniqueIds = result.fields.map((f: FieldConfig) => ({
//           ...f,
//           id:        f.id        ?? generateUniqueId(),
//           unique_id: generateUniqueId(),
//         }));
//         setFields(withUniqueIds);
//         setOriginalFields(withUniqueIds);
//         setTemplateName(result.template?.template_name ?? promptFromUrl.slice(0, 50));
//         setTemplateDescription(result.template?.description ?? promptFromUrl);
//         toast.success("AI template generated successfully!");
//       } else {
//         toast.error("AI did not return fields. Please try a more specific prompt.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to generate AI template. Please try again.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };
//


// ── PATCH 4 — Save generated document to API after preview ──────────────────
//
// FIND the handleSaveAndPreview function. Inside it, after the existing
// handleFinalSave() call and before the router.push to preview, ADD this block
// to save the completed document to the new /documents/create endpoint:
//
// FIND this block inside handleSaveAndPreview:
//   const result = await handleFinalSave();
//   if (result?.success) {
//     const previewPath = isCustomTemplate
//       ? `/dashboard/documents/preview/custom-template?data=...`
//       : `/dashboard/documents/preview/${templateName}?data=...`;
//
// REPLACE with:
//   const result = await handleFinalSave();
//   if (result?.success) {
//
//     // Save the completed filled document to the generated_documents table
//     try {
//       const userId = !loading ? user?.user?.user_id : null;
//       await axiosInstance.post("/documents/create", {
//         user_id:       userId,
//         template_id:   template_id ?? null,
//         document_name: templateName || "Untitled Document",
//         document_type: formData.header?.["Document Title"] ?? templateName ?? null,
//         field_values:  formData,
//         source:        isCustomTemplate ? "custom" : "template",
//       });
//     } catch (saveError) {
//       // Non-fatal — user still gets preview even if save fails
//       console.warn("Could not save document to archive:", saveError);
//     }
//
//     const previewPath = isCustomTemplate
//       ? `/dashboard/documents/preview/custom-template?data=${encodeURIComponent(JSON.stringify(formData))}`
//       : `/dashboard/documents/preview/${templateName}?data=${encodeURIComponent(JSON.stringify(formData))}`;
//     setTimeout(() => { router.push(previewPath); }, isCustomTemplate ? 2000 : 0);
//   }
//

// ═══════════════════════════════════════════════════════════════════════════
// END OF PATCHES
// Summary of what changes:
//   - fetchAIGeneratedFields now calls POST /templates/ai-generate (real AI)
//   - handleSaveAndPreview now also calls POST /documents/create to archive the doc
//   - Everything else (field CRUD, validation, preview navigation) is unchanged
// ═══════════════════════════════════════════════════════════════════════════
