export function optimizeRichText(html) {
  if(!html) return ""
  // 简单净化：移除脚本和样式标签以防XSS
  let sanitized = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');

  // 优化：为img添加lazy loading
  sanitized = sanitized.replace(/<img /g, '<img loading="lazy" ');
  sanitized = sanitized.replace(/width:\s*\d+px/g, 'width: 100%');
  sanitized = sanitized.replace(/width="\d+"/g, 'width="100%"');
  sanitized = sanitized.replace(/height:\s*\d+px/g, 'height: auto');
  sanitized = sanitized.replace(
    /<img/g,
    '<img style="max-width: 100%; height: auto;"'
  );

  // 其他优化，如移除多余空格
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}