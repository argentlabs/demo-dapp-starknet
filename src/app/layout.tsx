import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Demo dapp starknet",
  description:
    "Demo dapp for starknet using starknetjs, starknetkit and starknet-react",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
