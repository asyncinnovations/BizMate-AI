"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
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
  registration: UseFormRegisterReturn;
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
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[rgba(238,244,255,0.78)]"
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
            "w-full rounded-xl border bg-[#1a1a1a] px-4 py-3 text-sm text-[#eef4ff] outline-none transition-[border-color,box-shadow] duration-200",
            "placeholder:text-[#5c6d85]",
            "focus:border-[#1a6fff]/55 focus:ring-[3px] focus:ring-[rgba(26,111,255,0.12)]",
            error
              ? "border-[var(--error)] ring-[3px] ring-[var(--error-dim)]"
              : "border-transparent",
            rightElement && "pr-11"
          )}
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
      <div className="mb-8 sm:mb-9">
        <div className="animate-in mb-5 inline-flex items-center gap-2 rounded-full border border-[#1a6fff]/35 bg-[#0a1628] px-3.5 py-1.5 text-xs font-medium text-[#5eb0ff] sm:mb-6">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1a6fff] shadow-[0_0_8px_#1a6fff]" />
          Admin Panel Access
        </div>

        <h2 className="font-display animate-in delay-100 mb-2 text-3xl font-bold tracking-tight text-white sm:text-[2.125rem]">
          Welcome back
        </h2>
        <p className="animate-in delay-200 text-sm leading-relaxed text-[#8aa4c4]">
          Sign in to your administrator account.
        </p>
      </div>

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

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
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
                  className="flex items-center justify-center text-[#8aa4c4] opacity-60 transition-opacity hover:opacity-100"
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              }
            />
          </div>

          <div className="animate-in delay-500 flex items-center justify-between gap-3">
            <label className="group flex cursor-pointer items-center gap-2.5">
              <div className="relative flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="peer sr-only"
                />
                <div
                  className="flex h-4 w-4 items-center justify-center rounded border border-white/15 bg-[#141414] transition-all peer-checked:border-[#1a6fff] peer-checked:bg-[#1a6fff]/18"
                  aria-hidden="true"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <path
                      d="M2 5.3L4.1 7.2L8 3"
                      stroke="#4f8dff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-[#9db0c8]">Remember me</span>
            </label>

            <a
              href="/forgot-password"
              className="text-sm font-medium text-[#4da3ff] transition-opacity hover:opacity-90"
            >
              Forgot password?
            </a>
          </div>

          <div className="animate-in delay-600 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2.5",
                "rounded-xl border border-white/25 bg-black py-3.5 text-sm font-semibold tracking-wide text-white",
                "transition-[border-color,background-color,opacity] duration-200",
                isLoading
                  ? "cursor-not-allowed opacity-70 border-white/15"
                  : "hover:border-white/40 hover:bg-white/[0.04] active:scale-[0.995]"
              )}
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

      <div className="animate-in delay-600 mt-8 flex items-center justify-center gap-2 border-t border-white/10 pt-6">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M6 1L2 2.5v3C2 7.8 3.8 9.6 6 10c2.2-.4 4-2.2 4-4.5v-3L6 1z"
            stroke="rgba(138,164,196,0.55)" strokeWidth="1.2" strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs text-[#6b7f99]">Secured with 256-bit TLS encryption</span>
      </div>
    </div>
  );
}
