import type { WritingStyle, CopyResult } from './types';

function generateFallbackCopy(topic: string): CopyResult {
  return {
    title: `${topic}值得尝试吗？`,
    content: `关于${topic}，最近很多人在讨论这个话题。作为一个长期关注这方面的内容创作者，我也来分享一下自己的真实感受。\n\n说实话，一开始我对${topic}并没有抱太大期望，但实际尝试之后发现确实有不少值得记录的地方。今天这篇笔记就来详细聊聊我的体验过程和一些实用建议。\n\n希望能给正在了解${topic}的你一些参考。如果觉得有用，记得点赞收藏哦～`,
    hashtags: ['#小红书', '#经验分享', '#干货', '#真实测评', '#好物分享'],
  };
}

export async function generateCopy(
  topic: string,
  audience: string,
  style: WritingStyle,
): Promise<{ data: CopyResult; source: 'ai' | 'fallback' }> {
  try {
    const response = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, audience, style }),
    });

    if (!response.ok) {
      throw new Error(`API 返回状态 ${response.status}`);
    }

    const data: CopyResult = await response.json();

    if (!data.title || !data.content) {
      throw new Error('API 返回数据不完整');
    }

    return { data, source: 'ai' };
  } catch {
    return {
      data: generateFallbackCopy(topic),
      source: 'fallback',
    };
  }
}