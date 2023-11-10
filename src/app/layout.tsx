import type { Metadata } from "next";
import "../styles/build.css";

import { GridProvider } from "@/context/GridContext";

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
      <body>
        <GridProvider>{children}</GridProvider>
      </body>
    </html>
  );
}
