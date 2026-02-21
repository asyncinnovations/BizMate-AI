import React from "react";
import {
  ShieldCheck,
  ShieldOff,
  Loader2,
  KeyRound,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { TwoFactorSettingsData, TwoFactorMethod } from "./TwoFactorSettings";
import RecoveryPanel from "./RecoveryPanel";

interface TwoFactorStatusProps {
  settings: TwoFactorSettingsData | null;
  disableLoading: boolean;
  recoveryLoading: boolean;
  recoveryCodes: string[];
  showSetup: boolean;
  onDisable: () => void;
  onRegenerate: () => void;
  onToggleSetup: () => void;
  methodLabel: Record<TwoFactorMethod, string>;
}

const TwoFactorStatus: React.FC<TwoFactorStatusProps> = ({
  settings,
  disableLoading,
  recoveryLoading,
  recoveryCodes,
  showSetup,
  onDisable,
  onRegenerate,
  onToggleSetup,
  methodLabel,
}) => {
  const isEnabled = settings?.is_enabled;

  return (
    <>
      {/* Status Banner */}
      <div
        className={`flex items-center justify-between p-4 rounded-lg ${isEnabled
            ? "bg-status-success-bg border border-status-success-border"
            : "bg-bg-base border border-border"
          }`}
      >
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <ShieldCheck className="w-5 h-5 text-status-success shrink-0" />
          ) : (
            <ShieldOff className="w-5 h-5 text-text-muted shrink-0" />
          )}
          <div>
            <p className="font-medium text-text-heading text-sm">
              Two-Factor Authentication is{" "}
              <span className={isEnabled ? "text-status-success-text" : "text-text-muted"}>
                {isEnabled ? "Enabled" : "Disabled"}
              </span>
            </p>
            {isEnabled && (
              <p className="text-xs text-text-primary mt-0.5">
                Method: <span className="font-medium">{methodLabel[settings.method]}</span>
              </p>
            )}
          </div>
        </div>

        {isEnabled ? (
          <button
            onClick={onDisable}
            disabled={disableLoading}
            className="flex items-center gap-1.5 text-xs text-status-error hover:text-status-error-text font-medium border border-status-error-border bg-surface px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shrink-0"
          >
            {disableLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldOff className="w-3.5 h-3.5" />
            )}
            {disableLoading ? "Disabling..." : "Disable 2FA"}
          </button>
        ) : (
          <button
            onClick={onToggleSetup}
            className="flex items-center gap-1.5 text-xs text-secondary font-medium border border-secondary bg-surface px-3 py-1.5 rounded-md hover:bg-secondary-light transition-colors shrink-0"
          >
            <Shield className="w-3.5 h-3.5" />
            {showSetup ? "Cancel" : "Enable 2FA"}
            {showSetup ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* When 2FA is enabled: recovery codes row */}
      {isEnabled && (
        <div className="flex items-center justify-between p-4 bg-bg-base rounded-lg hover:bg-bg-subtle transition-colors">
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-md bg-surface border border-border">
              <KeyRound className="w-4 h-4 text-text-heading" />
            </div>
            <div>
              <p className="font-medium text-text-heading text-sm">Recovery Codes</p>
              <p className="text-xs text-text-primary">Generate new backup codes for your account</p>
            </div>
          </div>
          <button
            onClick={onRegenerate}
            disabled={recoveryLoading}
            className="flex items-center gap-1.5 text-xs text-secondary font-medium border border-secondary bg-surface px-3 py-1.5 rounded-md hover:bg-secondary-light transition-colors disabled:opacity-50 shrink-0"
          >
            {recoveryLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {recoveryLoading ? "Generating..." : "Regenerate"}
          </button>
        </div>
      )}

      {/* Newly generated codes when 2FA already enabled */}
      {isEnabled && recoveryCodes.length > 0 && (
        <div className="border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-text-heading mb-4 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-secondary" />
            New Recovery Codes
          </p>
          <RecoveryPanel codes={recoveryCodes} />
        </div>
      )}
    </>
  );
};

export default TwoFactorStatus;