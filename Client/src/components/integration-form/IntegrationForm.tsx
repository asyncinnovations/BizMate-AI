import React from "react";
import InputField from "../ui/InputField";

interface IntegrationFormProps {
  selectedIntegration: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  credentials: Record<string, string>;
}

export const IntegrationForm: React.FC<IntegrationFormProps> = ({
  selectedIntegration,
  onChange,
  credentials,
}) => {
  switch (selectedIntegration) {
    ///////////////////////////////////
    // Whatsapp Account Integration
    //////////////////////////////////////
    case "whatsapp":
      return (
        <>
          <InputField
            required={true}
            label="Phone Number ID"
            type="text"
            name="phone_number_id"
            value={credentials.phone_number_id}
            onChange={onChange}
            placeholder="Enter WhatsApp Phone Number ID"
          />

          <InputField
            required={true}
            label="Business Account ID"
            type="text"
            name="business_account_id"
            value={credentials.business_account_id}
            onChange={onChange}
            placeholder="Enter WhatsApp Business Account ID"
          />

          <InputField
            required={true}
            label="Access Token"
            type="password"
            name="access_token"
            value={credentials.access_token}
            onChange={onChange}
            placeholder="Enter Access Token"
          />
        </>
      );

    ///////////////////////////////////
    // Instagram Account Integration
    //////////////////////////////////////
    case "instagram":
      return (
        <>
          <InputField
            required={true}
            label="Instagram User ID"
            type="text"
            name="instagram_user_id"
            value={credentials.instagram_user_id}
            onChange={onChange}
            placeholder="Enter Instagram User ID"
          />

          <InputField
            required={true}
            label="App ID"
            type="text"
            name="app_id"
            value={credentials.app_id}
            onChange={onChange}
            placeholder="Enter Instagram App ID"
          />

          <InputField
            required={true}
            label="App Secret"
            type="password"
            name="app_secret"
            value={credentials.app_secret}
            onChange={onChange}
            placeholder="Enter Instagram App Secret"
          />

          <InputField
            required={true}
            label="Access Token"
            type="password"
            name="access_token"
            value={credentials.access_token}
            onChange={onChange}
            placeholder="Enter Instagram Access Token"
          />
        </>
      );

    /////////////////////////////////
    // Email Account Integration
    ///////////////////////////////////
    case "email":
      return (
        <>
          <InputField
            required={true}
            label="SMTP Host"
            type="text"
            name="smtp_host"
            value={credentials.smtp_host}
            onChange={onChange}
            placeholder="smtp.gmail.com"
          />

          <InputField
            required={true}
            label="SMTP Port"
            type="text"
            name="smtp_port"
            value={credentials.smtp_port}
            onChange={onChange}
            placeholder="587"
          />

          <InputField
            required={true}
            label="SMTP Username"
            type="text"
            name="smtp_username"
            value={credentials.smtp_username}
            onChange={onChange}
            placeholder="Enter SMTP Username"
          />

          <InputField
            required={true}
            label="SMTP Password"
            type="password"
            name="smtp_password"
            value={credentials.smtp_password}
            onChange={onChange}
            placeholder="Enter SMTP Password"
          />

          <InputField
            required={true}
            label="Sender Email"
            type="text"
            name="from_email"
            value={credentials.from_email}
            onChange={onChange}
            placeholder="your@email.com"
          />
        </>
      );

    ///////////////////////////////////////
    // Payment Integrations
    ////////////////////////////////////////

    case "stripe":
      return (
        <>
          <InputField
            type="text"
            label="Publishable Key"
            required={true}
            name="publishable_key"
            value={credentials.publishable_key}
            onChange={onChange}
            placeholder="pk_live_..."
          />
          <InputField
            required={true}
            label="Secret Key"
            type="password"
            name="secret_key"
            value={credentials.secret_key}
            onChange={onChange}
            placeholder="sk_live_..."
          />
          <InputField
            label="Webhook Secret"
            type="password"
            name="webhook_secret"
            value={credentials.webhook_secret}
            onChange={onChange}
            placeholder="whsec_..."
          />
        </>
      );

    case "paypal":
      return (
        <>
          <InputField
            required={true}
            label="Client ID"
            type="text"
            name="client_id"
            value={credentials.client_id}
            onChange={onChange}
            placeholder="Enter PayPal Client ID"
          />
          <InputField
            required={true}
            label="Client Secret"
            type="password"
            name="client_secret"
            value={credentials.client_secret}
            onChange={onChange}
            placeholder="Enter PayPal Client Secret"
          />
        </>
      );

    case "telr":
      return (
        <>
          <InputField
            required={true}
            label="Store ID"
            type="text"
            name="store_id"
            value={credentials.store_id}
            onChange={onChange}
            placeholder="Enter Telr Store ID"
          />
          <InputField
            required={true}
            label="Auth Key"
            type="password"
            name="auth_key"
            value={credentials.auth_key}
            onChange={onChange}
            placeholder="Enter Telr Auth Key"
          />
        </>
      );

    default:
      return null;
  }
};
