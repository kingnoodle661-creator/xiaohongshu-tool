import { NextResponse } from 'next/server';
import type { WritingStyle } from '@/features/copywriter/types';
import { callDeepSeekForObject } from '@/lib/deepseek';
import { buildCopywriterPrompt, COPYWRITER_SYSTEM_PROMPT } from '@/lib/prompt';

export const runtime = 'nodejs';

interface RequestBody {
  topic: string;
  audience: string;
  style: WritingStyle;
}

interface CopyResponse {
  title: string;
  content: string;
  hashtags: string[];
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { topic, audience, style } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: '主题不能为空' },
        { status: 400 },
      );
    }

    if (!audience || typeof audience !== 'string') {
      return NextResponse.json(
        { error: '目标人群不能为空' },
        { status: 400 },
      );
    }

    if (!style) {
      return NextResponse.json(
        { error: '写作风格不能为空' },
        { status: 400 },
      );
    }

    const userPrompt = buildCopywriterPrompt(topic.trim(), audience, style);

    const data = await callDeepSeekForObject<CopyResponse>([
      { role: 'system', content: COPYWRITER_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);

    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'AI 返回数据不完整' },
        { status: 500 },
      );
    }

    if (!data.hashtags || !Array.isArray(data.hashtags)) {
      data.hashtags = [];
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('生成文案失败:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 },
    );
  }
}