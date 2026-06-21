export type Audience = '学生' | '宝妈' | '打工人' | '副业党';

export type Goal = '涨粉' | '带货' | '引流';

export interface AudienceContext {
  call: string;
  pain: string;
  wish: string;
  scene: string;
}

export interface GoalContext {
  hook: string[];
  result: string[];
  action: string[];
  adj: string[];
  emoji: string;
  cta: string;
}