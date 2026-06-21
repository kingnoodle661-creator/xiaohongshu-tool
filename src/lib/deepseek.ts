import {
  DEEPSEEK_API_KEY,
  DEEPSEEK_BASE_URL,
  DEEPSEEK_MODEL,
  DEEPSEEK_TIMEOUT_MS,
  DEEPSEEK_MAX_RETRIES,
} from './config';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

function parseJsonResponse(content: string): string[] {
  const trimmed = content.trim();

  // 尝试直接解析
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // 继续尝试提取
  }

  // 尝试从 markdown 代码块中提取
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // 无效 JSON
    }
  }

  // 尝试用正则提取数组
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // 无效 JSON
    }
  }

  throw new Error('无法解析 DeepSeek 返回的内容为字符串数组');
}

async function requestWithRetry(
  messages: Message[],
  retriesLeft: number,
): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        temperature: 0.9,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`DeepSeek API 返回错误 ${response.status}: ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('DeepSeek 返回内容为空');
    }

    return parseJsonResponse(content);
  } catch (error) {
    if (retriesLeft > 0 && !(error instanceof DOMException && error.name === 'AbortError')) {
      return requestWithRetry(messages, retriesLeft - 1);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function callDeepSeek(messages: Message[]): Promise<string[]> {
  return requestWithRetry(messages, DEEPSEEK_MAX_RETRIES);
}

function parseJsonObject<T>(content: string): T {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // 继续尝试提取
  }

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // 无效 JSON
    }
  }

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]) as T;
    } catch {
      // 无效 JSON
    }
  }

  throw new Error('无法解析 DeepSeek 返回的内容为 JSON 对象');
}

async function requestObjectWithRetry<T>(
  messages: Message[],
  retriesLeft: number,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        temperature: 0.9,
        max_tokens: 2048,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`DeepSeek API 返回错误 ${response.status}: ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? '';

    if (!content) {
      throw new Error('DeepSeek 返回内容为空');
    }

    return parseJsonObject<T>(content);
  } catch (error: unknown) {
    if (retriesLeft > 0 && !(error instanceof DOMException && error.name === 'AbortError')) {
      return requestObjectWithRetry<T>(messages, retriesLeft - 1);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function callDeepSeekForObject<T>(messages: Message[]): Promise<T> {
  return requestObjectWithRetry<T>(messages, DEEPSEEK_MAX_RETRIES);
}
