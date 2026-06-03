"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";

// ─── Eye Icons ────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 2l12 12M6.5 6.5A2 2 0 0010 10M4 4.5C2.5 5.7 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M7 3.1c.3 0 .7-.1 1-.1 4.5 0 7 5 7 5s-.7 1.4-2 2.7"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="18" height="18" viewBox="0 0 18 18" fill="none"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
      <path
        d="M9 2a7 7 0 017 7"
        stroke="white" strokeWidth="2.5" strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  rightElement?: React.ReactNode;
  registration: ReturnType<typeof useForm<LoginFormData>>["register"] extends
    (name: keyof LoginFormData, ...args: unknown[]) => infer R
    ? R
    : never;
}

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  autoComplete,
  rightElement,
  registration,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: "rgba(238,244,255,0.8)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registration}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200",
            "placeholder:text-[var(--text-muted)]",
            rightElement && "pr-11"
          )}
          style={{
            background: "var(--bg-surface)",
            border: `1px solid ${error ? "var(--error)" : "var(--border)"}`,
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            boxShadow: error
              ? "0 0 0 3px var(--error-dim)"
              : undefined,
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.border = "1px solid var(--border-focus)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-dim)";
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.border = "1px solid var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p
          className="text-xs flex items-center gap-1.5"
          style={{ color: "var(--error)" }}
          role="alert"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error: serverError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="mb-8">
        <div
          className="animate-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            color: "#00c8e8",
            fontFamily: "var(--font-body)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#00c8e8", boxShadow: "0 0 6px #00c8e8" }}
          />
          Admin Panel Access
        </div>

        <h2
          className="animate-in delay-100 text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Welcome back
        </h2>
        <p
          className="animate-in delay-200 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Sign in to your administrator account to continue.
        </p>
      </div>

      {/* ── Server Error Banner ── */}
      {serverError && (
        <div
          className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-in"
          style={{
            background: "var(--error-dim)",
            border: "1px solid rgba(255,69,96,0.25)",
            color: "#ff8096",
          }}
          role="alert"
        >
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="flex-shrink-0 mt-0.5" aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="animate-in delay-300">
            <InputField
              id="email"
              label="Email address"
              type="email"
              placeholder="admin@bizmate.io"
              autoComplete="email"
              error={errors.email?.message}
              registration={register("email")}
            />
          </div>

          {/* Password */}
          <div className="animate-in delay-400">
            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              registration={register("password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="flex items-center justify-center transition-opacity hover:opacity-100 opacity-50"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              }
            />
          </div>

          {/* Remember me + Forgot password */}
          <div className="animate-in delay-500 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                  }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Remember me
              </span>
            </label>

            <a
              href="/forgot-password"
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <div className="animate-in delay-600 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2.5",
                "rounded-xl py-3.5 text-sm font-semibold tracking-wide",
                "transition-all duration-200",
                isLoading ? "opacity-80 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.99]"
              )}
              style={{
                background: isLoading
                  ? "var(--accent-mid)"
                  : "linear-gradient(135deg, var(--accent) 0%, #0f52cc 100%)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                boxShadow: isLoading
                  ? "none"
                  : "0 4px 24px rgba(26,111,255,0.35), 0 1px 0 rgba(255,255,255,0.1) inset",
              }}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── Divider / Security note ── */}
      <div
        className="animate-in delay-600 mt-8 pt-6 flex items-center justify-center gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M6 1L2 2.5v3C2 7.8 3.8 9.6 6 10c2.2-.4 4-2.2 4-4.5v-3L6 1z"
            stroke="rgba(120,152,184,0.6)" strokeWidth="1.2" strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Secured with 256-bit TLS encryption
        </span>
      </div>
    </div>
  );
}
