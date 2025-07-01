import { useState, useEffect, useRef } from 'react';
import './MarkdownTOC.css'; // 自訂 CSS

// 解析 markdown，擷取標題資訊
export function extractHeadings(markdown) {
  const lines = markdown.split('\n');
  return lines
    .filter(line => /^#{1,6} /.test(line))
    .map(line => {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, '');
      const id = text
        .toLowerCase()
        .replace(/[^\u4e00-\u9fa5\w\s-]/g, '') // 去除特殊符號（中英混合支援）
        .replace(/\s+/g, '-');
      return { level, text, id };
    });
}

// 使用 IntersectionObserver 追蹤最上方可見的標題 ID
export function useActiveHeader(headings) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    const elements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean);

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

// TOC 元件本體，支援 active 自動 scrollIntoView
export function TOC({ headings, activeId }) {
  const tocRefs = useRef({}); // 儲存每個 toc-item 對應的 ref

  useEffect(() => {
    const activeEl = tocRefs.current[activeId];
    if (activeEl && activeEl.scrollIntoView) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [activeId]);

  return (
    <div className="toc">
      <div className="toc-title">目錄</div>
      {headings.map(({ level, text, id }) => (
        <div
          key={id}
          ref={el => (tocRefs.current[id] = el)}
          className={`toc-item level-${level} ${activeId === id ? 'active' : ''}`}
          onClick={() => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}
