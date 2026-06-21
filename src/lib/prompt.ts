import type { Audience, Goal } from '@/features/title-generator/types';
import type { WritingStyle } from '@/features/copywriter/types';

export function buildTitlePrompt(
  topic: string,
  audience: Audience,
  goal: Goal,
): string {
  return `你是小红书爆款标题生成专家，擅长制造高点击率标题。

要求：
- 输出20条标题
- 必须适配小红书风格
- 包含情绪词、数字、对比、反差
- 每条不超过25字
- 输出纯数组JSON，不要任何解释

用户输入：
主题：${topic}
人群：${audience}
目标：${goal}`;
}

export const SYSTEM_PROMPT =
  '你是小红书爆款标题生成专家，擅长制造高点击率标题。每次输出必须是纯JSON数组，不包含任何解释文字。';

export function buildCopywriterPrompt(
  topic: string,
  audience: string,
  style: WritingStyle,
): string {
  return `你是专业小红书爆文写作专家，擅长写出高互动率的种草笔记。

请以${style}的风格，为"${audience}"人群写一篇关于"${topic}"的小红书笔记。

严格输出 JSON 对象，格式如下：
{"title":"","content":"","hashtags":[]}

规则：
1. 标题高点击率，含情绪词和数字
2. 正文600~1000字，用口语化小红书风格
3. 包含开头钩子吸引阅读
4. 包含真实体验感和细节
5. 包含结尾互动引导（点赞/收藏/评论）
6. hashtags 返回 5 个热门标签
7. 禁止输出解释文字
8. 禁止输出 Markdown
9. 只允许输出 JSON 对象`;
}

export const COPYWRITER_SYSTEM_PROMPT =
  '你是专业小红书爆文写作专家。每次输出必须是纯JSON对象 {"title":"","content":"","hashtags":[]}，不包含任何解释文字。';
