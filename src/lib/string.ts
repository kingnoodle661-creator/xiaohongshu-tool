export function tagify(topic: string): string {
  return topic.replace(/\s/g, '');
}