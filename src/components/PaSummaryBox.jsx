'use client';

import { useState } from 'react';

export default function PaSummaryBox({ data }) {
  // data is filtered to type === '개념'
  // Group by chapter (중단원) -> subChapter (소단원)
  const grouped = data.reduce((acc, item) => {
    const chap = item.chapter || '기타';
    const sub = item.subChapter || '일반';
    
    if (!acc[chap]) acc[chap] = {};
    if (!acc[chap][sub]) acc[chap][sub] = [];
    
    acc[chap][sub].push(item);
    return acc;
  }, {});

  const [expandedChaps, setExpandedChaps] = useState(
    Object.keys(grouped).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  
  const [expandedSubs, setExpandedSubs] = useState({});
  const [selectedConcept, setSelectedConcept] = useState(null);

  const toggleChap = (chap) => {
    setExpandedChaps(prev => ({ ...prev, [chap]: !prev[chap] }));
  };

  const toggleSub = (chap, sub) => {
    const key = `${chap}-${sub}`;
    setExpandedSubs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (Object.keys(grouped).length === 0) {
    return <div className="empty-state glass-card">해당 단원의 구조도 요약 데이터가 없습니다.</div>;
  }

  return (
    <div className="pa-summary-container" style={{ position: 'relative' }}>
      {Object.entries(grouped).map(([chap, subs]) => (
        <div key={chap} className="pa-chap-group glass-card" style={{ marginBottom: '1rem', padding: '1rem' }}>
          <div 
            className="pa-chap-header" 
            onClick={() => toggleChap(chap)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent)' }}
          >
            <span style={{ marginRight: '0.5rem', transform: expandedChaps[chap] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</span>
            📁 {chap}
          </div>
          
          {expandedChaps[chap] && (
            <div className="pa-chap-content" style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              {Object.entries(subs).map(([sub, items]) => {
                const subKey = `${chap}-${sub}`;
                return (
                  <div key={sub} className="pa-sub-group" style={{ marginBottom: '1rem' }}>
                    <div 
                      className="pa-sub-header" 
                      onClick={() => toggleSub(chap, sub)}
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}
                    >
                      <span style={{ marginRight: '0.5rem', transform: expandedSubs[subKey] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', fontSize: '0.8rem' }}>▶</span>
                      📂 {sub}
                    </div>
                    
                    {expandedSubs[subKey] && (
                      <div className="pa-sub-content" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="pa-keyword-btn" 
                            onClick={() => setSelectedConcept(item)}
                            style={{ 
                              padding: '0.75rem 1rem', 
                              background: 'rgba(255,255,255,0.05)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              color: '#c084fc',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>📄 {item.keyword}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>자세히 보기</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Modal Overlay */}
      {selectedConcept && (() => {
        const currentIndex = data.findIndex(item => item === selectedConcept);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < data.length - 1;

        const goPrev = (e) => {
          e.stopPropagation();
          if (hasPrev) setSelectedConcept(data[currentIndex - 1]);
        };

        const goNext = (e) => {
          e.stopPropagation();
          if (hasNext) setSelectedConcept(data[currentIndex + 1]);
        };

        return (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
          }} onClick={() => setSelectedConcept(null)}>
            <div style={{
              background: 'var(--bg-color)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    {selectedConcept.chapter} &gt; {selectedConcept.subChapter}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: '#c084fc', margin: 0 }}>{selectedConcept.keyword}</h3>
                </div>
                <button 
                  onClick={() => setSelectedConcept(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{
                padding: '1.5rem',
                overflowY: 'auto',
                flex: 1
              }}>
                <div style={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: '1.8', 
                  fontSize: '1.05rem', 
                  color: 'var(--text-primary)' 
                }}>
                  {selectedConcept.content}
                </div>
              </div>

              {/* Navigation Footer */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.2)',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px'
              }}>
                <button 
                  onClick={goPrev} 
                  disabled={!hasPrev}
                  className="icon-btn"
                  style={{ opacity: hasPrev ? 1 : 0.3, cursor: hasPrev ? 'pointer' : 'default' }}
                >
                  ◀ 이전
                </button>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {currentIndex + 1} / {data.length}
                </div>
                <button 
                  onClick={goNext} 
                  disabled={!hasNext}
                  className="icon-btn"
                  style={{ opacity: hasNext ? 1 : 0.3, cursor: hasNext ? 'pointer' : 'default' }}
                >
                  다음 ▶
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
