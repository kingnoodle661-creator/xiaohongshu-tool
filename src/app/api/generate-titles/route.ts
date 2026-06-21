import { NextResponse } from 'next/server';
import type { Audience, Goal } from '@/features/title-generator/types';
import { callDeepSeek } from '@/lib/deepseek';
import { buildTitlePrompt, SYSTEM_PROMPT } from '@/lib/prompt';

export const runtime = 'nodejs';

interface RequestBody {
  topic: string;
  audience: Audience;
  goal: Goal;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { topic, audience, goal } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: '主题不能为空' },
        { status: 400 },
      );
    }

    const userPrompt = buildTitlePrompt(topic.trim(), audience, goal);

    const titles = await callDeepSeek([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);

    const normalized = titles.filter(Boolean).slice(0, 20);

    const fallbackTitles = [
      `${topic}一定要知道的5个技巧`,
      `${topic}避坑指南`,
      `${topic}新手入门攻略`,
      `${topic}实测有效的方法`,
      `${topic}超详细教程`,
    ];

    let fallbackIndex = 0;
    while (normalized.length < 20) {
      normalized.push(fallbackTitles[fallbackIndex % fallbackTitles.length]);
      fallbackIndex++;
    }

    const numbered = normalized.map((title, index) => `${index + 1}. ${title}`);

    return NextResponse.json({ titles: numbered });
  } catch (error) {
    console.error('生成标题失败:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 },
    );
  }
}