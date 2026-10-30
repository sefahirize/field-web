import { Inter } from "next/font/google";
import "@landing/styles/globals.css";
import NotFound, { notFoundMetadata } from "@landing/components/NotFound";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = notFoundMetadata;

// Rendered for URLs that match no route, outside both root layouts, so it
// brings its own fonts and styles. Uses the landing's 404 design.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <NotFound />
      </body>
    </html>
  );
}
