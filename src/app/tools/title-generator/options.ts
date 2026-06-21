import type { Audience, Goal } from '@/features/title-generator/types';

interface Option<T> {
  value: T;
  label: string;
}

export const AUDIENCE_OPTIONS: Option<Audience>[] = [
  { value: '学生', label: '学生' },
  { value: '宝妈', label: '宝妈' },
  { value: '打工人', label: '打工人' },
  { value: '副业党', label: '副业党' },
];

export const GOAL_OPTIONS: Option<Goal>[] = [
  { value: '涨粉', label: '涨粉' },
  { value: '带货', label: '带货' },
  { value: '引流', label: '引流' },
];