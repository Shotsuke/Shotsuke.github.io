"""Check generated Polar Night routes using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'public'

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.links = []
        self.in_article = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article' and 'prose' in attrs.get('class', ''):
            self.in_article += 1
        if tag in ('link', 'script'):
            self.assets.append(attrs.get('href') or attrs.get('src') or '')
        if tag == 'img' and not self.in_article:
            self.assets.append(attrs.get('src', ''))
        if tag == 'a' and not self.in_article:
            self.links.append(attrs.get('href', ''))
    def handle_endtag(self, tag):
        if tag == 'article' and self.in_article:
            self.in_article -= 1

def check_target(url):
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc:
        return
    path = parsed.path
    if not path.startswith('/') or path.startswith('//'):
        return
    target = PUBLIC / unquote(path).lstrip('/')
    if path.endswith('/'):
        target /= 'index.html'
    assert target.is_file(), f'Missing target: {url}'

assert PUBLIC.is_dir(), 'Run hexo generate first.'
for page in ['index.html', 'novel/index.html', 'archives/index.html', 'categories/index.html', 'about/index.html', 'friends/index.html']:
    assert (PUBLIC / page).is_file(), f'Missing page: {page}'
count = 0
for page in PUBLIC.rglob('*.html'):
    html = page.read_text()
    if '/css/polar.css' not in html:
        continue
    count += 1
    parser = Links()
    parser.feed(html)
    for url in parser.assets + parser.links:
        check_target(url)
    assert '<%= ' not in html, f'Unrendered template: {page}'
posts = json.loads((PUBLIC / 'search.json').read_text())
assert posts and len({post['url'] for post in posts}) == len(posts)
for post in posts:
    check_target(post['url'])
    assert post['title'] and isinstance(post['content'], str)
assert any('Life-and-Death-Reversal' in p['url'] for p in posts)
assert (PUBLIC / 'js/mathjax/tex-svg.js').is_file()
print(f'PASS: {count} generated pages, {len(posts)} searchable posts, theme navigation and assets.')
