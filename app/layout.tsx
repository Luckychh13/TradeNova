import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";



export const metadata: Metadata = {
  title: "TradeNova",
  description: "Crypto screener app with a built in high frequency terminal & Dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className= "dark"
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        </body>
    </html>
  );
}
