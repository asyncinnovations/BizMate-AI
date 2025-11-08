// app/settings/components/AIAssistantTab.tsx
"use client";

import React, { useState } from "react";
import { Globe, Bot, Database, Shield } from "lucide-react";
import SectionCard from "@/app/components/section-card/SectionCard";
import ToggleSwitch from "@/app/components/ui/ToggleSwitch";

const AIAssistantTab: React.FC = () => {
  const [smartSuggestions, setSmartSuggestions] = useState(true);

  return (
    <div className="space-y-6">
      <SectionCard title="Language Settings" icon={Globe}>
        <div>
          <label className="block text-sm font-medium text-[#344767] mb-2">
            Default AI Language
          </label>
          <select className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
      </SectionCard>

      <SectionCard title="AI Personality" icon={Bot}>
        <div>
          <label className="block text-sm font-medium text-[#344767] mb-3">
            AI Tone
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Formal", "Friendly", "Neutral"].map((tone) => (
              <button
                key={tone}
                className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                  tone === "Friendly"
                    ? "border-[#2E69A4] bg-[#2E69A4] text-white"
                    : "border-[#E1E8F5] text-[#344767] hover:border-[#2E69A4]"
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Smart Features" icon={Database}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1B2A49]">
                Enable Smart Suggestions
              </p>
              <p className="text-sm text-[#344767]">
                AI provides proactive business suggestions
              </p>
            </div>
            <ToggleSwitch
              enabled={smartSuggestions}
              onChange={() => setSmartSuggestions(!smartSuggestions)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1B2A49]">Auto-Complete Forms</p>
              <p className="text-sm text-[#344767]">
                AI helps fill out invoices and documents
              </p>
            </div>
            <ToggleSwitch enabled={true} onChange={() => {}} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Data Privacy" icon={Shield}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1B2A49]">
                Allow Training on Your Data
              </p>
              <p className="text-sm text-[#344767]">
                Help improve AI by analyzing your chat interactions
              </p>
            </div>
            <ToggleSwitch enabled={false} onChange={() => {}} />
          </div>
          <div className="p-4 bg-[#F4F7FA] rounded-lg">
            <p className="text-sm text-[#344767]">
              Your business data is encrypted and secure. Disabling training
              means AI won't learn from your specific interactions, but core
              features remain functional.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default AIAssistantTab;
