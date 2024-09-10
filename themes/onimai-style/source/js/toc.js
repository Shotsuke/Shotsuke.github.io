document.addEventListener('DOMContentLoaded', function () {
    const tocContainer = document.getElementById('toc');
    if (!tocContainer) return;

    // 获取所有的标题元素
    const headers = document.querySelectorAll('article h1, article h2, article h3');

    if (!headers.length) return; // 如果没有找到标题，返回

    let tocList = document.createElement('ul');

    headers.forEach(header => {
        const tocItem = document.createElement('li');
        const tocLink = document.createElement('a');

        // 创建对应的锚点链接
        tocLink.textContent = header.textContent;
        tocLink.href = '#' + header.id;

        if (header.tagName === 'H1') {
            tocItem.classList.add('toc-h1');
        }
        else if (header.tagName === 'H2') {
            tocItem.classList.add('toc-h2');
        }
        else if (header.tagName === 'H3') {
            tocItem.classList.add('toc-h3');
        }

        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
    });

    tocContainer.appendChild(tocList);
});