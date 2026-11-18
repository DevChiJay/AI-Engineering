import { Player } from "@/kolo_deck/Player";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Motion story",
    absoluteTitle: "Kolo · motion story",
    path: "/story/",
    image: "story",
    description: "An 86-second motion story for the Kolo concept: a circle of friends, the Kolo Pot, contributions arriving, Circle Health, the app and payout day. Demo data; no returns promised.",
  }),
  robots: { index: false, follow: false },
};

export default function StoryPage() {
  return <Player />;
}
