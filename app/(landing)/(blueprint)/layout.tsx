import { blueprintFonts } from "@landing/blueprint/fonts";
import { RevealObserver } from "@landing/blueprint/RevealObserver";
import { SiteFooter } from "@landing/blueprint/SiteFooter";
import { SiteHeader } from "@landing/blueprint/SiteHeader";
import s from "@landing/blueprint/site.module.css";

// Pages in the new Blueprint design. They share its header, footer, fonts
// and tokens; the old-design pages keep their own layouts under (primary)
// and (secondary) until they are rebuilt.
export default function BlueprintLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${blueprintFonts} ${s.site}`}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <RevealObserver />
    </div>
  );
}
