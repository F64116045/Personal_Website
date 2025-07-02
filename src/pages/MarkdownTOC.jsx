import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './MarkdownTOC.css';

// ✅ 配置選項
const DEFAULT_CONFIG = {
    containerSelector: '.markdown-content',
    headingSelector: 'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]',
    katexSelector: '.katex',
    observerOptions: {
        rootMargin: '-10% 0px -70% 0px', // 調整觸發區域
        threshold: [0, 0.1, 0.3, 0.5],
    },
    scrollBehavior: {
        behavior: 'smooth',
        block: 'start',
    },
};

// ✅ 從畫面中實際渲染的 markdown DOM 抓標題（優化版）
export function getRenderedHeadings(config = {}) {
    const {
        containerSelector = DEFAULT_CONFIG.containerSelector,
        headingSelector = DEFAULT_CONFIG.headingSelector,
        katexSelector = DEFAULT_CONFIG.katexSelector,
    } = config;

    try {
        const container = document.querySelector(containerSelector);
        if (!container) {
        return [];
        }

        const fullSelector = `${containerSelector} ${headingSelector}`;
        const elements = document.querySelectorAll(fullSelector);
        
        if (!elements.length) {
        return [];
        }

        return Array.from(elements)
        .map(el => {
            try {
            const level = parseInt(el.tagName[1]);
            if (isNaN(level) || level < 1 || level > 6) {
                return null;
            }

            const cloned = el.cloneNode(true);
            const katexElements = cloned.querySelectorAll(katexSelector);
            katexElements.forEach(k => k.remove());

            const rawText = cloned.textContent?.trim() || '';
            const id = el.id?.trim();

            if (!id || !rawText) {
                return null;
            }

            return {
                level,
                text: rawText,
                id,
                element: el,
            };
            } catch (error) {
            console.error('處理標題元素時發生錯誤:', error, el);
            return null;
            }
        })
        .filter(Boolean);
    } catch (error) {
        console.error('獲取標題時發生錯誤:', error);
        return [];
    }
}

// ✅ 修正的 IntersectionObserver Hook
// 修正版本的 useActiveHeader 函數
export function useActiveHeader(headings, config = {}) {
    const [activeId, setActiveId] = useState(null);
    const observerRef = useRef(null);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);
    
    const {
        containerSelector = DEFAULT_CONFIG.containerSelector,
        observerOptions = DEFAULT_CONFIG.observerOptions,
    } = config;

    // 處理交集變化的回調函數
    const handleIntersection = useCallback((entries) => {
        if (isScrollingRef.current) return;

        try {
        const visibleEntries = entries
            .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0)
            .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            return Math.abs(aTop) - Math.abs(bTop);
            });

        if (visibleEntries.length > 0) {
            const newActiveId = visibleEntries[0].target.id;
            setActiveId(prev => prev !== newActiveId ? newActiveId : prev);
        }
        } catch (error) {
        console.error('處理交集觀察時發生錯誤:', error);
        }
    }, []);

    // 監聽滾動事件
    useEffect(() => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const handleScroll = () => {
        isScrollingRef.current = true;
        
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 150);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        };
    }, [containerSelector]);

    useEffect(() => {
        // 清理舊的觀察器
        if (observerRef.current) {
        observerRef.current.disconnect();
        }

        if (!headings || headings.length === 0) {
        setActiveId(null);
        return;
        }

        // 🔥 關鍵修正：找到實際的滾動容器
        const scrollContainer = document.querySelector(containerSelector);
        if (!scrollContainer) {
        return;
        }

        try {
        // 🔥 重要：設置 root 為實際的滾動容器，而不是 viewport
        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: scrollContainer, // 👈 這裡是關鍵修正
            rootMargin: observerOptions.rootMargin,
            threshold: observerOptions.threshold,
        });

        // 觀察所有標題元素
        const validElements = headings
            .map(h => h.element || document.getElementById(h.id))
            .filter(Boolean);

        if (validElements.length === 0) {
            return;
        }

        validElements.forEach(el => {
            observerRef.current.observe(el);
        });

        } catch (error) {
        console.error('創建 IntersectionObserver 時發生錯誤:', error);
        }

        return () => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
        };
    }, [headings, observerOptions.rootMargin, observerOptions.threshold, handleIntersection, containerSelector]);

    return activeId;
}

// ✅ 優化的目錄元件
export function TOC({ 
    headings = [], 
    activeId, 
    className = '',
    title = '目錄',
    config = {},
    onItemClick
    }) {
    const tocRefs = useRef({});
    const containerRef = useRef(null);
    const isClickScrollingRef = useRef(false);
    
    const { scrollBehavior = DEFAULT_CONFIG.scrollBehavior } = config;

    // 清理無效的引用
    useEffect(() => {
        const currentIds = new Set(headings.map(h => h.id));
        Object.keys(tocRefs.current).forEach(id => {
        if (!currentIds.has(id)) {
            delete tocRefs.current[id];
        }
        });
    }, [headings]);

    // 自動滾動到活躍項目 - 減少頻率
    useEffect(() => {
        if (!activeId || !tocRefs.current[activeId] || !containerRef.current || isClickScrollingRef.current) {
        return;
        }

        const timer = setTimeout(() => {
        try {
            const activeElement = tocRefs.current[activeId];
            const container = containerRef.current;
            
            if (!activeElement || !container) return;
            
            const containerRect = container.getBoundingClientRect();
            const elementRect = activeElement.getBoundingClientRect();

            const isVisible = (
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom
            );

            if (!isVisible) {
            activeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
            }
        } catch (error) {
            console.error('自動滾動時發生錯誤:', error);
        }
        }, 100); // 延遲執行

        return () => clearTimeout(timer);
    }, [activeId]);

    // 處理點擊事件
    const handleItemClick = useCallback((heading, event) => {
        event.preventDefault();
        
        // 設置點擊滾動狀態
        isClickScrollingRef.current = true;
        
        try {
        if (onItemClick) {
            const shouldContinue = onItemClick(heading, event);
            if (shouldContinue === false) {
            isClickScrollingRef.current = false;
            return;
            }
        }

        const targetElement = heading.element || document.getElementById(heading.id);
        if (targetElement) {
            targetElement.scrollIntoView(scrollBehavior);
            
            // 重置點擊滾動狀態
            setTimeout(() => {
            isClickScrollingRef.current = false;
            }, 1000);
            
            // 更新 URL hash
            if (window.history && window.history.pushState) {
            const url = new URL(window.location);
            url.hash = heading.id;
            window.history.replaceState(null, '', url);
            }
        } else {
            isClickScrollingRef.current = false;
        }
        } catch (error) {
        console.error('處理點擊事件時發生錯誤:', error);
        isClickScrollingRef.current = false;
        }
    }, [onItemClick, scrollBehavior]);

    if (!headings || headings.length === 0) {
        return null;
    }

    return (
        <nav 
        className={`toc ${className}`.trim()}
        role="navigation"
        aria-label="目錄導航"
        ref={containerRef}
        >
        {title && (
            <div className="toc-title" role="heading" aria-level="2">
            {title}
            </div>
        )}
        <ul className="toc-list" role="list">
            {headings.map(({ level, text, id }, index) => {
            const isActive = activeId === id;
            const key = `${id}-${index}`;
            
            return (
                <li
                key={key}
                ref={el => {
                    if (el && id) {
                    tocRefs.current[id] = el;
                    }
                }}
                className={`toc-item level-${level} ${isActive ? 'active' : ''}`.trim()}
                role="listitem"
                >
                <button
                    type="button"
                    className="toc-link"
                    onClick={(e) => handleItemClick({ level, text, id, element: headings[index].element }, e)}
                    aria-current={isActive ? 'location' : undefined}
                    title={`跳轉到: ${text}`}
                >
                    <span className="toc-text">{text}</span>
                </button>
                </li>
            );
            })}
        </ul>
        </nav>
    );
}

// ✅ 簡化的 AutoTOC 元件
export function AutoTOC({ 
    config = {},
    className = '',
    title = '目錄',
    onItemClick,
    refreshInterval = 0,
    }) {
    const [headings, setHeadings] = useState([]);
    const lastUpdateRef = useRef(0);

    // 節流的刷新函數
    const refreshHeadings = useCallback(() => {
        const now = Date.now();
        if (now - lastUpdateRef.current < 200) return; // 最小間隔 200ms
        
        lastUpdateRef.current = now;
        
        try {
        const newHeadings = getRenderedHeadings(config);
        setHeadings(prev => {
            const prevIds = prev.map(h => h.id).join(',');
            const newIds = newHeadings.map(h => h.id).join(',');
            
            if (prevIds !== newIds) {
            return newHeadings;
            }
            return prev;
        });
        } catch (error) {
        console.error('刷新標題時發生錯誤:', error);
        }
    }, [config]);

    // 初始化
    useEffect(() => {
        const timer = setTimeout(refreshHeadings, 100);
        return () => clearTimeout(timer);
    }, [refreshHeadings]);

    // 簡化的 DOM 監聽 - 只監聽重要變化
    useEffect(() => {
        const targetNode = document.querySelector(config.containerSelector || DEFAULT_CONFIG.containerSelector);
        if (!targetNode) return;

        const observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
            const hasHeadingChanges = 
                Array.from(mutation.addedNodes).some(node => 
                node.nodeType === Node.ELEMENT_NODE && 
                (/^H[1-6]$/i.test(node.tagName) || node.querySelector && node.querySelector('h1, h2, h3, h4, h5, h6'))
                ) ||
                Array.from(mutation.removedNodes).some(node => 
                node.nodeType === Node.ELEMENT_NODE && 
                (/^H[1-6]$/i.test(node.tagName) || node.querySelector && node.querySelector('h1, h2, h3, h4, h5, h6'))
                );
            
            if (hasHeadingChanges) {
                shouldRefresh = true;
                break;
            }
            }
        }

        if (shouldRefresh) {
            refreshHeadings();
        }
        });

        observer.observe(targetNode, {
        childList: true,
        subtree: true,
        });

        return () => observer.disconnect();
    }, [config.containerSelector, refreshHeadings]);

    const activeId = useActiveHeader(headings, config);

    return (
        <TOC
        headings={headings}
        activeId={activeId}
        className={className}
        title={title}
        config={config}
        onItemClick={onItemClick}
        />
    );
}

export { DEFAULT_CONFIG };