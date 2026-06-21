import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 no-underline">
          <span className="text-2xl">📕</span>
          <span>小红书工具箱</span>
        </Link>
      </div>
    </header>
  );
}