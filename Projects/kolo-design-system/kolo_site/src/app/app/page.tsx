import { OverviewScreen } from "@/components/screens/OverviewScreen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Overview",
  path: "/app/",
  description: "Circle Health 86, the Pot at ₦200,000 of ₦300,000 and your payout turn on Fri 27 Feb, with one suggested action. Demo data.",
});

export default function Page() {
  return <OverviewScreen />;
}
