export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "date" | "number" | "textarea" | "select";
  placeholder?: string;
  required: boolean;
  options?: string[];
  aiSuggestion?: string;
  helpText?: string;
}
