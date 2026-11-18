import { PayoutsScreen } from "@/components/screens/PayoutsScreen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Payouts",
  path: "/app/payouts/",
  description: "Round 2 payout schedule for the Friday Circle: three turns collected, Adaeze next on Fri 27 Feb. Demo data.",
});

export default function Page() {
  return <PayoutsScreen />;
}
