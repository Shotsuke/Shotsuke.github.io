'use strict';

const fs = require('fs');
const path = require('path');

hexo.extend.helper.register('polar_title', function (title) {
  return String(title || '').replace(/\s*<[^>]*>\s*$/, '').trim();
});
hexo.extend.helper.register('polar_category', function (name) {
  return ({'Course Notes': '课程笔记', 'Paper Notes': '论文阅读', 'Build Notes': '搭建手记', 'Environment Build': '环境配置', Tarot: '塔罗手记', Fictions: '小说', uncategorized: '随笔'})[name] || name;
});
hexo.extend.helper.register('polar_excerpt', function (post, length = 110) {
  const strip = hexo.extend.helper.get('strip_html');
  const text = strip(String(post.excerpt || post.content || '')).replace(/\s+/g, ' ').trim();
  return text.length > length ? text.slice(0, length) + '…' : text;
});
hexo.extend.helper.register('polar_novel', function () {
  return this.site.posts.findOne({slug: this.theme.novel.post_slug});
});
hexo.extend.helper.register('polar_active', function (key) {
  const p = this.page.path || '';
  if (key === 'home') return this.is_home();
  if (key === 'archives') return this.is_archive() || this.is_category() || this.is_tag() || p.startsWith('categories/');
  return p.startsWith(key + '/');
});
hexo.extend.generator.register('polar-search', function (locals) {
  const strip = hexo.extend.helper.get('strip_html');
  const url = hexo.extend.helper.get('url_for').bind(hexo);
  return {path: 'search.json', data: JSON.stringify(locals.posts.sort('-date').map(post => ({
    title: String(post.title), url: url(post.path),
    excerpt: strip(String(post.excerpt || '')).replace(/\s+/g, ' '),
    content: strip(String(post.content || '')).replace(/\s+/g, ' '),
    categories: post.categories.map(c => c.name)
  })))};
});
// Serve the existing MathJax dependency locally, so long notes do not rely on a CDN.
hexo.extend.generator.register('polar-math', function () {
  if (!hexo.theme.config.math) return [];
  const base = path.join(hexo.base_dir, 'node_modules/mathjax/es5');
  const extensions = path.join(base, 'input/tex/extensions');
  const names = ['tex-svg.js', 'ui/menu.js', 'a11y/assistive-mml.js', ...fs.readdirSync(extensions).filter(name => name.endsWith('.js')).map(name => 'input/tex/extensions/' + name)];
  return names.filter(name => fs.existsSync(path.join(base, name))).map(name => ({
    path: 'js/mathjax/' + name,
    data: () => fs.createReadStream(path.join(base, name))
  }));
});
