'use client';

import { useState } from 'react';
import type { WritingStyle, CopyResult } from '@/features/copywriter/types';
import { generateCopy } from '@/features/copywriter/generator';

const AUDIENCE_OPTIONS = [
  { value: '学生', label: '学生' },
  { value: '宝妈', label: '宝妈' },
  { value: '打工人', label: '打工人' },
  { value: '副业党', label: '副业党' },
];

const STYLE_OPTIONS: { value: WritingStyle; label: string }[] = [
  { value: '真实分享', label: '真实分享' },
  { value: '种草推荐', label: '种草推荐' },
  { value: '经验总结', label: '经验总结' },
  { value: '干货教程', label: '干货教程' },
];

export default function CopywriterClient() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('学生');
  const [style, setStyle] = useState<WritingStyle>('真实分享');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<CopyResult | null>(null);
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setCopied(false);

    try {
      const res = await generateCopy(topic.trim(), audience, style);
      setResult(res.data);
      setSource(res.source);
    } catch {
      setResult(null);
      setSource(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = async () => {
    if (!result) return;
    const text = `${result.title}\n\n${result.content}\n\n${result.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">AI 文案生成</h1>
      <p className="mb-8 text-gray-500">
        输入主题，AI 一键生成完整小红书笔记文案
      </p>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label
            htmlFor="topic"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            主题
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerate();
            }}
            placeholder="例如：减脂早餐、通勤穿搭、考研复习..."
            maxLength={50}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-red"
          />
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="audience"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              目标人群
            </label>
            <select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-brand-red"
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="style"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              写作风格
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value as WritingStyle)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-brand-red"
            >
              {STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red py-3 font-semibold text-white transition-all hover:bg-brand-red-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              AI 生成中...
            </>
          ) : (
            '✨ AI 生成文案'
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
          {source === 'fallback' && (
            <div className="rounded-t-xl border-b border-yellow-200 bg-yellow-50 px-6 py-3 text-sm text-yellow-700">
              AI服务暂时不可用，当前结果来自离线模板
            </div>
          )}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
              生成结果
              {source === 'ai' && (
                <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  AI
                </span>
              )}
              {source === 'fallback' && (
                <span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  离线模式
                </span>
              )}
            </h2>
            <button
              onClick={handleCopyAll}
              className="rounded-full border border-brand-red px-4 py-1.5 text-sm font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white"
            >
              {copied ? '已复制 ✓' : '复制全文'}
            </button>
          </div>

          <div className="px-6 py-4">
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              {result.title}
            </h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {result.content}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block rounded-full bg-brand-red-light px-3 py-1 text-xs font-medium text-brand-red"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}