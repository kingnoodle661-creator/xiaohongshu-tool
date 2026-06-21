import type { Metadata } from "next";
import TitleGeneratorClient from "./TitleGeneratorClient";

export const metadata: Metadata = {
  title: "AI标题生成器 - 小红书工具箱",
  description: "输入主题，一键生成20条小红书爆款标题。",
};

export default function TitleGeneratorPage() {
  return <TitleGeneratorClient />;
}