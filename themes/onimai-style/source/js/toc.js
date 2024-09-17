// document.addEventListener('DOMContentLoaded', function () {
//     const tocContainer = document.getElementById('toc');
//     if (!tocContainer) return;

//     // 获取所有的标题元素
//     const headers = document.querySelectorAll('article h1, article h2, article h3');

//     if (!headers.length) return; // 如果没有找到标题，返回

//     let tocList = document.createElement('ul');

//     headers.forEach(header => {
//         const tocItem = document.createElement('li');
//         const tocLink = document.createElement('a');

//         // 创建对应的锚点链接
//         tocLink.textContent = header.textContent;
//         tocLink.href = '#' + header.id;

//         if (header.tagName === 'H1') {
//             tocItem.classList.add('toc-h1');
//         }
//         else if (header.tagName === 'H2') {
//             tocItem.textContent = '--' + tocItem.textContent;
//             tocItem.classList.add('toc-h2');
//         }
//         else if (header.tagName === 'H3') {
//             tocItem.textContent = '----' + tocItem.textContent;
//             tocItem.classList.add('toc-h3');
//         }

//         tocItem.appendChild(tocLink);
//         tocList.appendChild(tocItem);
//     });

//     tocContainer.appendChild(tocList);
// });

document.addEventListener('DOMContentLoaded', function () {
    const tocContainer = document.getElementById('toc');
    if (!tocContainer) return;

    const headers = document.querySelectorAll('article h1, article h2, article h3');
    if (!headers.length) return;

    const tree = document.createElement('ul');
    let lasth1 = null, lasth2 = null;
    const children = new Map();

    headers.forEach(header => {
        const tocItem = document.createElement('li');
        const tocLink = document.createElement('a');
        tocLink.textContent = header.textContent;
        tocLink.href = '#' + header.id;
        tocItem.appendChild(tocLink);

        if (header.tagName === 'H1') {
            // 如果是 H1，直接添加到根树上
            tree.appendChild(tocItem);
            lasth1 = tocItem;
            lasth2 = null;
            if (children.has(headers)) {
                children.set(headers, 1 + children.get(headers));
            }
            else {
                children.set(headers, 1);
            }
        } else if (header.tagName === 'H2') {
            if (lasth1) {
                // 如果是 H2，将其添加到上一个 H1 的子节点
                let sublist = lasth1.querySelector('ul');
                if (!sublist) {
                    sublist = document.createElement('ul');
                    lasth1.appendChild(sublist);
                }
                sublist.appendChild(tocItem);
                lasth2 = tocItem;

                tocLink.textContent = '--' + tocLink.textContent;

                if (children.has(lasth1)) {
                    children.set(lasth1, 1 + children.get(lasth1));
                }
                else {
                    children.set(lasth1, 1);
                }
            }
            else {
                console.error('Error in document structure.');
            }
        } else if (header.tagName === 'H3') {
            if (lasth2) {
                // 如果是 H3，将其添加到上一个 H2 的子节点
                let sublist = lasth2.querySelector('ul');
                if (!sublist) {
                    sublist = document.createElement('ul');
                    lasth2.appendChild(sublist);
                }
                sublist.appendChild(tocItem);

                tocLink.textContent = '----' + tocLink.textContent;

                if (children.has(lasth2)) {
                    children.set(lasth2, 1 + children.get(lasth2));
                }
                else {
                    children.set(lasth2, 1);
                }
            }
        } else {
            console.error('Error in document structure.');
        }
    });

    console.log(children);


    function addTocPrefix(header, level, cnt, prefix) {

    }

    addTocPrefix(headers, 1);

    tocContainer.appendChild(tree);
});
