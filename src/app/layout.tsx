import type { Metadata } from "next";
import "../styles/build.css";

export const metadata: Metadata = {
  title: "Immaculate Vibes Grid presented by Plague Poppets",
  description:
    "Test your knowledge of historical NFT projects with the Immaculate Vibes Grid presented by Plague Poppets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
