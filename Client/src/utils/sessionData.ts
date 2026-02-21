// ================= DETECTION HELPERS =================

export const detectBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  return "Unknown Browser";
};

export const detectOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Windows NT")) return "Windows";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown OS";
};

export const detectDeviceName = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("iPad")) return "iPad";
  if (ua.includes("Android")) return "Android Device";
  return "Desktop";
};

// ================= NETWORK HELPERS =================

export const fetchIPAddress = async (): Promise<string> => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "Unknown";
  } catch {
    return "Unknown";
  }
};

export const fetchLocation = async (ip: string): Promise<string> => {
  try {
    if (ip === "Unknown") return "Unknown";
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    const city = data.city || "";
    const country = data.country_name || "";
    return [city, country].filter(Boolean).join(", ") || "Unknown";
  } catch {
    return "Unknown";
  }
};

// ================= SESSION BODY BUILDER =================
// Call this after login to get the full body to pass to POST /user-sessions/create

export interface SessionPayload {
  user_id: string;
  device_name: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
}

export const buildSessionPayload = async (
  userId: string
): Promise<SessionPayload> => {
  const ip = await fetchIPAddress();
  const location = await fetchLocation(ip);

  return {
    user_id: userId,
    device_name: detectDeviceName(),
    browser: detectBrowser(),
    os: detectOS(),
    ip_address: ip,
    location,
  };
};