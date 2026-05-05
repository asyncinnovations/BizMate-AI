import React from "react";

interface NavIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ICONS: Record<string, React.FC<{ size: number }>> = {
  dashboard: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  users: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 4c1.7 0 3 1.3 3 3s-1.3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 17c0-2-1.1-3.8-2.8-4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  businesses: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 18V8l7-5 7 5v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 18v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 13v5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  subscriptions: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 13h3M13 13h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  documents: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 2h7l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  compliance: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5v5c0 4.4 3 8 7 9 4-1 7-4.6 7-9V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ai: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2.5V4M10 16v1.5M2.5 10H4M16 10h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  analytics: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 16l4.5-6L10 13l3.5-8L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  support: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  roles: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 18v-1a6 6 0 0112 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 13.5l3 1M11.5 13.5l-3 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  notifications: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5c-3 0-5.5 2.2-5.5 5.5 0 3.5-1.5 5-1.5 5h14s-1.5-1.5-1.5-5C15.5 4.7 13 2.5 10 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 13c0 1.1.9 2 2 2s2-.9 2-2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  settings: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  collapse: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  expand: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  bell: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5c-3 0-5.5 2.2-5.5 5.5 0 3.5-1.5 5-1.5 5h14s-1.5-1.5-1.5-5C15.5 4.7 13 2.5 10 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 13c0 1.1.9 2 2 2s2-.9 2-2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  chevronDown: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M8 3H4a1 1 0 00-1 1v12a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 13l4-3-4-3M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function NavIcon({ name, size = 18, className, style }: NavIconProps) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return (
    <span className={className} style={{ display: "inline-flex", ...style }}>
      <Icon size={size} />
    </span>
  );
}
