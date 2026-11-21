import { Home } from "@/components/home";

export default function Page() {
  return (
    <Home submissionsEnabled={Boolean(process.env.EARLY_ACCESS_WEBHOOK_URL)} />
  );
}
