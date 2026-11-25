import type { Metadata } from "next";

import { HomePage } from "@landing/blueprint/home/HomePage";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { buildPageMetadata } from "@landing/lib/seo/page-metadata";

export const generateMetadata = (): Metadata => buildPageMetadata(PAGE_SETTINGS.homepage);

export default function Home() {
  return <HomePage />;
}
