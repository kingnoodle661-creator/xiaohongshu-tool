export type WritingStyle = '真实分享' | '种草推荐' | '经验总结' | '干货教程';

export interface CopyResult {
  title: string;
  content: string;
  hashtags: string[];
}