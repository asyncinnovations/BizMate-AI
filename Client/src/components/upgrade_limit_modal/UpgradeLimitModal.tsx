"use client";

/**
 * UpgradeLimitModal
 *
 * Reusable modal shown whenever a subscription usage limit is reached.
 * Use this across any page that enforces a plan limit:
 *   - Document Generator (document_templates)
 *   - Invoice page (invoice_limit_per_month)
 *   - AI Chat page (ai_messages_per_month)
 *
 * @example
 * <UpgradeLimitModal
 *   isOpen={isUpgradeModalOpen}
 *   onClose={() => setIsUpgradeModalOpen(false)}
 *   featureLabel="Custom Templates"
 *   usedCount={2}
 *   limitCount={2}
 *   planName="Trial"
 * />
 */

import React from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ArrowRight, Lock, TrendingUp } from "lucide-react";

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Human-readable feature name e.g. "Custom Templates", "Invoices", "AI Messages" */
  featureLabel: string;
  /** How many the user has used so far (pass 0 if unknown) */
  usedCount?: number;
  /** The plan's limit value. Pass -1 for unlimited, 0 for not available. */
  limitCount?: number;
  /** Current plan name e.g. "Trial", "Starter" */
  planName?: string;
}

const UpgradeLimitModal: React.FC<UpgradeLimitModalProps> = ({
  isOpen,
  onClose,
  featureLabel,
  usedCount = 0,
  limitCount = 0,
  planName,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const isNotAvailable = limitCount === 0;
  const percent =
    !isNotAvailable && limitCount > 0
      ? Math.min(Math.round((usedCount / limitCount) * 100), 100)
      : 100;

  const handleUpgrade = () => {
    onClose();
    router.push("/dashboard/pricing");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-surface rounded-2xl shadow-raised border border-border pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-base transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 bg-status-warning-bg border border-status-warning-border rounded-2xl mx-auto mb-5">
              <Lock className="w-6 h-6 text-status-warning" />
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-text-heading text-center mb-2">
              {isNotAvailable
                ? `${featureLabel} Not Available`
                : `${featureLabel} Limit Reached`}
            </h2>

            {/* Sub */}
            <p className="text-sm text-text-secondary text-center mb-6 leading-relaxed">
              {isNotAvailable ? (
                <>
                  <span className="font-semibold text-text-heading">
                    {featureLabel}
                  </span>{" "}
                  {planName ? (
                    <>
                      is not included in the{" "}
                      <span className="font-semibold text-text-heading">
                        {planName}
                      </span>{" "}
                      plan.
                    </>
                  ) : (
                    "is not included in your current plan."
                  )}{" "}
                  Upgrade to unlock this feature.
                </>
              ) : (
                <>
                  You&apos;ve used all{" "}
                  <span className="font-semibold text-text-heading">
                    {limitCount} {featureLabel}
                  </span>{" "}
                  included in your{" "}
                  {planName ? (
                    <span className="font-semibold text-text-heading">
                      {planName}
                    </span>
                  ) : (
                    "current"
                  )}{" "}
                  plan. Upgrade to get more.
                </>
              )}
            </p>

            {/* Usage bar — only shown when there's a numeric limit */}
            {!isNotAvailable && limitCount > 0 && (
              <div className="mb-6 p-4 bg-bg-base rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
                    {featureLabel} Used
                  </span>
                  <span className="text-xs font-bold text-status-error">
                    {usedCount} / {limitCount}
                  </span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-status-error rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-status-error font-semibold mt-2">
                  Limit reached — resets next billing cycle
                </p>
              </div>
            )}

            {/* What you get on upgrade */}
            <div className="mb-6 p-4 bg-brand-light border border-secondary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                  Upgrade to unlock
                </span>
              </div>
              <ul className="space-y-2">
                {[
                  `More ${featureLabel.toLowerCase()}`,
                  "Advanced AI features",
                  "Priority support",
                  "Team collaboration",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUpgrade}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-semibold text-sm transition-all hover:shadow-raised"
              >
                <Zap className="w-4 h-4" />
                Upgrade Plan
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 px-5 border border-border text-text-secondary hover:bg-bg-base rounded-xl font-semibold text-sm transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradeLimitModal;
