import type { Metadata } from "next";
import CopywriterClient from "./CopywriterClient";

export const metadata: Metadata = {
  title: "AI文案生成器 - 小红书工具箱",
  description: "输入主题和风格，一键生成完整小红书文案。",
};

export default function CopywriterPage() {
  return <CopywriterClient />;
}