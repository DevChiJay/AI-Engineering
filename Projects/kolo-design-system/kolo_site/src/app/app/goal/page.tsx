import { GoalScreen } from "@/components/screens/GoalScreen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Goal",
  path: "/app/goal/",
  description: "Adaeze's rent deposit: her ₦300,000 payout covers 75% of ₦400,000. Kolo gives no financial advice. Demo data.",
});

export default function Page() {
  return <GoalScreen />;
}
