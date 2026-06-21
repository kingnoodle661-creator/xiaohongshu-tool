import type { Audience, Goal } from './types';
import { AUDIENCE_CTX, GOAL_CTX } from './constants';
import { pick, pickN } from '@/lib/random';

/**
 * 静态模板降级方案
 * 当 AI API 不可用时返回 10 条固定模板标题
 */
function generateFallbackTitles(
  topic: string,
  audience: Audience,
  goal: Goal,
): string[] {
  const ctx = AUDIENCE_CTX[audience];
  const g = GOAL_CTX[goal];
  const formulas = [
    () => `${pick(['后悔没早', '千万别', '绝了！', '谁懂啊'])}知道${topic}还能${pick(g.hook)}`,
    () => `${pick(['3个', '5个', '7个'])}${topic}秘诀，第${pick(['2', '3'])}个帮我${pick(g.result)}`,
    () => `做了${pick(['2个月', '半年'])}${topic}，${audience}说点掏心窝的话`,
    () => `${ctx.pain}？${topic}这招${pick(g.adj)}（${goal}向）`,
    () => `${audience}亲测｜${topic}从0开始，我只改了${pick(['3', '4'])}个地方`,
    () => `关于${topic}，${pick(['90%', '大部分人'])}都搞错了这${pick(['1', '2', '3'])}点`,
    () => `从${pick(['0粉', '没人看', '完全没流量'])}到${pick(g.result)}，${topic}我做对了啥`,
    () => `${pick(['24岁', '28岁', '32岁'])}${audience}，靠${topic}${pick(['实现了', '拿到了'])}${pick(g.result)}`,
    () => `${topic}踩过的${pick(['5', '7'])}个坑，${pick(['第3个', '最后一个'])}差点让我放弃`,
    () => `劝退！${topic}前先看完这篇，能少交${pick(['一半', '好多'])}学费`,
    () => `${ctx.scene}搞${topic}？我试了${pick(['3周', '1个月'])}，结果出乎意料`,
    () => `${pick(['没想到', '反差太大了', '离谱'])}！${topic}和网上说的完全不一样`,
    () => `${audience}必藏｜${topic}${pick(['保姆级', '超详细'])}攻略（${goal}版）`,
    () => `为什么你做${topic}没效果？问题可能出在这`,
    () => `${pick(g.adj)}！${topic}原来可以这么玩`,
    () => `${topic}｜${pick(['一周', '一个月'])}见效的${pick(['笨办法', '土方子'])}，但真有用`,
    () => `别再做${topic}了！除非你想${pick(g.result)}`,
    () => `${ctx.call}！${topic}这件事我必须唠唠`,
    () => `${pick(['低成本', '零门槛'])}${topic}，${audience}照着做就行`,
    () => `${topic} vs ${pick(['老方法', '别人教的'])}，差距不是一点半点`,
    () => `被${topic}改变${pick(['30天', '3个月'])}，我的真实日记`,
    () => `${pick(['深夜', '周末'])}${topic}，${audience}的${pick(['自救', '逆袭'])}记录`,
    () => `我妈说我疯了，但${topic}真的帮我${pick(g.result)}`,
    () => `${topic}新手别慌，按这个顺序来少走${pick(['80%', '90%'])}弯路`,
    () => `${pick(['月入', '轻松'])}${pick(['1k', '3k', '5k'])}？${topic}${goal}真的行`,
  ];

  return pickN(formulas, 10).map((fn, i) => `${i + 1}. ${fn()}`);
}

/**
 * AI 驱动版本：调用 DeepSeek API Route
 * 失败时自动降级到静态模板
 */
export async function generateTitles(
  topic: string,
  audience: Audience,
  goal: Goal,
): Promise<{ titles: string[]; source: 'ai' | 'fallback' }> {
  try {
    const response = await fetch('/api/generate-titles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, audience, goal }),
    });

    if (!response.ok) {
      throw new Error(`API 返回状态 ${response.status}`);
    }

    const data: { titles: string[] } = await response.json();

    if (!data.titles || !Array.isArray(data.titles) || data.titles.length === 0) {
      throw new Error('API 返回标题为空');
    }

    return { titles: data.titles, source: 'ai' };
  } catch {
    return {
      titles: generateFallbackTitles(topic, audience, goal),
      source: 'fallback',
    };
  }
}