'use client';

import { useState } from 'react';
import type { Audience, Goal } from '@/features/title-generator/types';
import { generateTitles } from '@/features/title-generator/generator';

const AUDIENCE_OPTIONS: { value: Audience; label: string }[] = [
  { value: '学生', label: '学生' },
  { value: '宝妈', label: '宝妈' },
  { value: '打工人', label: '打工人' },
  { value: '副业党', label: '副业党' },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: '涨粉', label: '涨粉' },
  { value: '带货', label: '带货' },
  { value: '引流', label: '引流' },
];

export default function TitleGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState<Audience>('学生');
  const [goal, setGoal] = useState<Goal>('涨粉');
  const [titles, setTitles] = useState<string[]>([]);
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setCopied(false);

    try {
      const result = await generateTitles(topic.trim(), audience, goal);
      setTitles(result.titles);
      setSource(result.source);
    } catch {
      setTitles([]);
      setSource(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = async () => {
    const text = titles.join('\n');
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
      <h1 className="mb-2 text-3xl font-bold text-gray-900">AI 标题生成</h1>
      <p className="mb-8 text-gray-500">
        输入主题，AI 一键生成 20 条小红书爆款标题
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
            placeholder="例如：平价护肤、考研备考、宝宝辅食..."
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
              onChange={(e) => setAudience(e.target.value as Audience)}
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
              htmlFor="goal"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              内容目标
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-brand-red"
            >
              {GOAL_OPTIONS.map((opt) => (
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
            '✨ AI 生成'
          )}
        </button>
      </div>

      {titles.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
          {source === 'fallback' && (
            <div className="rounded-t-xl border-b border-yellow-200 bg-yellow-50 px-6 py-3 text-sm text-yellow-700">
              AI服务暂时不可用，当前结果来自离线模板
            </div>
          )}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
              爆款标题
              <span className="inline-block rounded-full bg-brand-red-light px-2 py-0.5 text-xs font-medium text-brand-red">
                {titles.length}条
              </span>
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
              {copied ? '已复制 ✓' : '复制全部'}
            </button>
          </div>

          <div className="px-6 py-4">
            {titles.map((title, index) => {
              const match = title.match(/^(\d+)\.\s*(.+)/);
              const num = match ? match[1] : '';
              const text = match ? match[2] : title;
              return (
                <div
                  key={index}
                  className="border-b border-gray-50 py-3 last:border-b-0"
                >
                  <span className="font-semibold text-brand-red">{num}. </span>
                  {text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}