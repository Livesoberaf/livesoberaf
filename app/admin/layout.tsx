import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geist.variable} font-sans`}>{children}</div>;
}
