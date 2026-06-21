const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
  throw new Error('缺少 DEEPSEEK_API_KEY 环境变量');
}

export const DEEPSEEK_API_KEY = apiKey;

export const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export const DEEPSEEK_MODEL = 'deepseek-chat';

export const DEEPSEEK_TIMEOUT_MS = 10_000;

export const DEEPSEEK_MAX_RETRIES = 1;