# Prompt 2: Spec, Claude Design, Then the Web App

Work in the same Kolo folder used for the earlier projects. In your setup this is `Desktop/KOLO_TEST` (or wherever your `kolo` folder lives). Save this step's outputs there and reuse the existing assets.

Attach the **approved landing-page design from prompt 1** alongside the **Kolo design system**. The page you liked is the visual benchmark for the app. Claude Design creates new screens here, then Claude Code implements them. Keep Next.js/React, TypeScript, Tailwind and Recharts from the established stack, with GSAP for coordinated transitions.

Copy and paste this:

```text
Context: Build Kolo's companion app with the visual quality of our approved landing page and the Kolo design system.

Instruction: Write kolo_web_app_spec.md first. Then design Overview, Circle, Contributions, Payouts and Goal in Claude Design with six months of consistent dummy data for Adaeze and the Friday Circle, including the late January contributions. Follow the Kolo design system; prefer the approved landing page for the overall look. Animate tab changes, chart-to-detail zooms and Pot/Circle Health updates; keep values readable and controls responsive. Create expanded member and payout detail panels and polished empty states. Implement at /app with our established stack and connect "Explore demo." Include metadata, reduced motion and keyboard access. Show amounts in naira (₦). Check against the spec.

Input: Kolo's approved landing page and kolo/brand/Kolo_Product_Spec.md.

Output: spec, new prototype, dummy dataset, kolo_site and PROJECT_INFO.md.
```
