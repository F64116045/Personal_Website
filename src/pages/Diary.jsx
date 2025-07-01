import { useEffect, useState } from "react";
import './Diary.css';
import { createPortal } from 'react-dom';
import { supabase } from "../supabase";
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { TOC, extractHeadings, useActiveHeader } from './MarkdownTOC';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function Diary_modal({ selectedDiary, setSelectedDiary }) {
  const [shouldRender, setShouldRender] = useState(false);

  const content = typeof selectedDiary?.Diary_content === 'string'
    ? selectedDiary.Diary_content
    : '';
  const headings = extractHeadings(content);
  const activeId = useActiveHeader(headings);

  useEffect(() => {
    if (!selectedDiary) return;
    const timer = setTimeout(() => setShouldRender(true), 300);
    return () => {
      clearTimeout(timer);
      setShouldRender(false);
    };
  }, [selectedDiary]);

  if (!selectedDiary || typeof window === 'undefined' || !document?.body) return null;

  return createPortal(
    <div className="diary-modal-overlay" onClick={() => setSelectedDiary(null)}>
        <div className="diary-modal-content" onClick={(e) => e.stopPropagation()}>
        <h1>{selectedDiary.Diary_title}</h1>
        <span className="close-button" onClick={() => setSelectedDiary(null)}>X</span>

        <div className="diary-modal-layout">
            {shouldRender ? (
            <>
                <div className="toc">
                <TOC headings={headings} activeId={activeId} />
                </div>
                <div className="markdown-content rich-text markdown-body">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeSlug, rehypeKatex]}
                >
                    {content}
                </ReactMarkdown>
                </div>
            </>
            ) : (
            <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '18px', animation: 'blink 1.2s infinite' }}>
                內容加載中...
                </p>
            </div>
            )}
        </div>
        </div>
    </div>,
    document.body
    );
}



function Diary() {
  const [loading, setLoading] = useState(true);
  const [diaryData, setDiaryData] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Diary')
        .select('*')
        .order('Diary_time', { descending: true });

      if (error) {
        console.error('Supabase 錯誤 : ', error);
      } else {
        setDiaryData(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>載入中...</p>;

  return (
    <div className="Diary-page">
      <div className="diary-title">筆記與日誌</div>
      <div className="Diarys">
        {diaryData.map(diary => {
          const { Diary_title, Diary_content, Diary_time, id } = diary;
          return (
            <div
              key={id}
              className="diary-item"
              onClick={() => { setSelectedDiary(diary); }}
            >
              <div>{Diary_title}</div>
              <div>點擊查看</div>
              <div>{new Date(Diary_time).toLocaleDateString()}</div>
            </div>
          );
        })}
      </div>
      <Diary_modal selectedDiary={selectedDiary} setSelectedDiary={setSelectedDiary} />
    </div>
  );
}

export default Diary;
