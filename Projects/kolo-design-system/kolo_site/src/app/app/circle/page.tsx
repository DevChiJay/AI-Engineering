import { CircleScreen } from "@/components/screens/CircleScreen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Circle",
  path: "/app/circle/",
  description: "The Friday Circle's six members, who has paid this cycle and each member's payout turn. Demo data.",
});

export default function Page() {
  return <CircleScreen />;
}
