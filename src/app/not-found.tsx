import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="mb-4 text-6xl font-bold text-brand-red">404</h1>
      <h2 className="mb-6 text-xl text-gray-600">页面不存在</h2>
      <Link
        href="/"
        className="inline-block rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-red-dark"
      >
        返回首页
      </Link>
    </div>
  );
}