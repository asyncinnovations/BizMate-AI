import { redirect } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/constants/admin";

export default function LegacyDashboardPath() {
  redirect(ADMIN_BASE_PATH);
}
