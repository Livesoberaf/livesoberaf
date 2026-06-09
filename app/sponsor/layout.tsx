import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
  // Apply the Geist variable so font-sans resolves correctly on all sponsor pages
  return <div className={`${geist.variable} font-sans`}>{children}</div>;
}
