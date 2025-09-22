import type { Metadata } from "next";
import { Karma } from "next/font/google";
import "./globals.css";

const karma = Karma({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Q Supply Chain",
  description: "Company website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${karma.className} bg-white text-black`}>
        {children}
      </body>
    </html>
  );
}
