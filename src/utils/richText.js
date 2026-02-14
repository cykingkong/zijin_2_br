export function optimizeRichText(html) {
  if (!html) return ""
  // 简单净化：移除脚本和样式标签以防XSS
  let sanitized = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');

  // 优化：为img添加lazy loading
  sanitized = sanitized.replace(/<img /g, '<img loading="lazy" ');
  // 只处理img标签的style属性中的width和height
  sanitized = sanitized.replace(/(<img[^>]*style="[^"]*?)width:\s*\d+px([^>]*>)/g, '$1width: 100%$2');
  sanitized = sanitized.replace(/(<img[^>]*style="[^"]*?)height:\s*\d+px([^>]*>)/g, '$1height: auto$2');
  // 只处理img标签的width和height属性
  sanitized = sanitized.replace(/(<img[^>]*?)width="\d+"([^>]*>)/g, '$1width="100%"$2');
  sanitized = sanitized.replace(/(<img[^>]*?)height="\d+"([^>]*>)/g, '$1height="auto"$2');
  // 为没有style属性的img添加响应式样式
  sanitized = sanitized.replace(/<img(?!.*style=)/g, '<img style="max-width: 100%; height: auto;"');

  // 其他优化，如移除多余空格
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}