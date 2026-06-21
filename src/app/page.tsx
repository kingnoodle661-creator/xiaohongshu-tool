import type { Tool } from "@/types";
import HeroSection from "@/components/HeroSection";
import ToolCard from "@/components/ToolCard";

const tools: Tool[] = [
  {
    title: "AI 标题生成",
    description: "输入主题，一键生成20条小红书爆款标题",
    icon: "✍️",
    href: "/tools/title-generator",
    available: true,
  },
  {
    title: "AI 文案生成",
    description: "自动生成完整笔记正文，支持多种风格",
    icon: "📝",
    href: "/tools/copywriter",
    available: true,
  },
  {
    title: "AI 改写",
    description: "改写已有文案，降低查重率，提升原创度",
    icon: "🔄",
    href: "#",
    available: false,
  },
  {
    title: "AI 扩写",
    description: "将简短内容扩展为丰富详实的完整笔记",
    icon: "📈",
    href: "#",
    available: false,
  },
  {
    title: "AI 缩写",
    description: "将长文精简为精华版，适合快速阅读",
    icon: "📋",
    href: "#",
    available: false,
  },
  {
    title: "敏感词检测",
    description: "检测文案中的敏感词和违规内容，安全发布",
    icon: "🔍",
    href: "#",
    available: false,
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            全部工具
          </h2>
          <p className="mt-2 text-gray-500">
            每个工具都经过小红书运营场景优化
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-8 text-center text-sm text-gray-400">
        <p>小红书工具箱 — 让创作更高效</p>
      </footer>
    </>
  );
}