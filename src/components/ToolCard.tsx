import Link from "next/link";
import type { Tool } from "@/types";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const content = (
    <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 text-3xl">{tool.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
      <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
      <span className="mt-4 inline-block rounded-full bg-brand-red-light px-3 py-1 text-xs font-medium text-brand-red">
        {tool.available ? "立即使用" : "即将上线"}
      </span>
    </div>
  );

  if (tool.available) {
    return (
      <Link href={tool.href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}