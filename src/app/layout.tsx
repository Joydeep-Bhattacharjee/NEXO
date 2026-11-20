import type { Metadata } from "next";
import { Big_Shoulders, Hind_Siliguri } from "next/font/google";
import { ZoneTransitionLayer } from "@/components/anon/ZoneTransition";
import { ThemeApplier } from "@/components/ui/ThemeApplier";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

/** Scoreboard display face: condensed, loud, used for the wordmark and headlines only. */
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: "variable",
});

/** One body family drawn for both Bengali and Latin, so বাংলা and English sit together. */
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nexo · Play loud, post quiet",
  description: "Clips, communities, and an anonymous zone built for gamers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ZoneTransitionLayer />
        <Toaster />
        <ThemeApplier />
      </body>
    </html>
  );
}
