import { ContributionsScreen } from "@/components/screens/ContributionsScreen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contributions",
  path: "/app/contributions/",
  description: "Six months of contributions for Adaeze and the Friday Circle, September to February, including January's late payments. Demo data.",
});

export default function Page() {
  return <ContributionsScreen />;
}
