import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Go Mail by GoGentik | Email, Reimagined for Business",
  description:
    "Your email stays where it is. Everything gets better. Explore Go Mail: an intelligent business email experience designed for organized conversations, security awareness, and connected teams.",
  applicationName: "Go Mail",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  keywords: [
    "Go Mail",
    "GoGentik",
    "business email",
    "organization inbox",
    "email security awareness",
    "enterprise email",
  ],
  openGraph: {
    title: "Go Mail | Email, Reimagined for Business",
    description:
      "Keep your email. Upgrade your experience. An intelligent business email platform by GoGentik.",
    type: "website",
    locale: "en_US",
    siteName: "Go Mail by GoGentik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Mail | Email, Reimagined for Business",
    description: "Your email stays where it is. Everything gets better.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
