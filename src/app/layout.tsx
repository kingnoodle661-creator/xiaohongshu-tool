import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "小红书工具箱 - AI小红书运营助手",
  description:
    "AI生成小红书标题、文案、改写、扩写，提升内容创作效率。",
  keywords: [
    "小红书工具",
    "小红书标题生成",
    "小红书文案生成",
    "AI运营工具",
    "小红书爆款标题",
  ],
  openGraph: {
    title: "小红书工具箱 - AI小红书运营助手",
    description:
      "AI生成小红书标题、文案、改写、扩写，提升内容创作效率。",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "小红书工具箱 - AI小红书运营助手",
    description:
      "AI生成小红书标题、文案、改写、扩写，提升内容创作效率。",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}