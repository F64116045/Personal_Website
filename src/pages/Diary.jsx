import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';
import './Diary.css';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { TOC, getRenderedHeadings, useActiveHeader } from './MarkdownTOC';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import LoadingScreen from '../component/LoadingScreen'; 

export function Diary_modal({ selectedDiary, setSelectedDiary }) {
    const [shouldRender, setShouldRender] = useState(false);
    const [headings, setHeadings] = useState([]);
    const markdownRef = useRef(null);

    const content =
        typeof selectedDiary?.Diary_content === 'string'
        ? selectedDiary.Diary_content
        : '';


    useEffect(() => {
        if (!selectedDiary) return;
        setShouldRender(false);
        const timer = setTimeout(() => setShouldRender(true), 200);
        return () => clearTimeout(timer);
    }, [selectedDiary]);


    useEffect(() => {
        if (!shouldRender) return;
        const timer = setTimeout(() => {
        const result = getRenderedHeadings(); 
        setHeadings(result);
        }, 100);
        return () => clearTimeout(timer);
    }, [shouldRender, content]);

    const activeId = useActiveHeader(headings);

        if (!selectedDiary || typeof window === 'undefined') return null;

    return createPortal(
        <div className="diary-modal-overlay" onClick={() => setSelectedDiary(null)}>
        <div className="diary-modal-content" onClick={e => e.stopPropagation()}>
            <h1>{selectedDiary.Diary_title}</h1>
            <span className="close-button" onClick={() => setSelectedDiary(null)}>X</span>

            <div className="diary-modal-layout">
            {shouldRender ? (
                <>
                <div className="toc">
                    <TOC headings={headings} activeId={activeId} />
                </div>
                <div
                    className="markdown-content rich-text markdown-body"
                    ref={markdownRef}
                >
                    <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeSlug, rehypeKatex]}
                    >
                    {content}
                    </ReactMarkdown>
                </div>
                </>
            ) : (
                <LoadingScreen />
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
        .order('Diary_time', { ascending: true });

      if (error) {
        console.error('Supabase 錯誤 : ', error);
      } else {
        setDiaryData(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <LoadingScreen/>;

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
