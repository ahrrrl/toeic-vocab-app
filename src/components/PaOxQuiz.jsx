'use client';

import { useState } from 'react';

export default function PaOxQuiz({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  if (!data || data.length === 0) {
    return <div className="empty-state glass-card">해당 단원의 OX 퀴즈 데이터가 없습니다.</div>;
  }

  const currentQuiz = data[currentIndex];

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setShowResult(false);
      setSelectedAnswer(null);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isCorrect = selectedAnswer === currentQuiz.answer;

  return (
    <div className="quiz-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', alignItems: 'center', marginBottom: '1rem' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0} 
          className="icon-btn"
          style={{ opacity: currentIndex === 0 ? 0.3 : 1, cursor: currentIndex === 0 ? 'default' : 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          이전
        </button>
        <div className="progress-text" style={{ marginBottom: 0 }}>
          {currentIndex + 1} / {data.length}
        </div>
        <button 
          onClick={handleNext} 
          className="icon-btn"
        >
          다음
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="flashcard" style={{ cursor: 'default' }}>
        <div className="word-section" style={{ flexDirection: 'column', height: 'auto', minHeight: '200px' }}>
          <div style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {currentQuiz.chapter} {currentQuiz.subChapter ? `> ${currentQuiz.subChapter}` : ''}
          </div>
          <div className="word-display" style={{ fontSize: 'calc(1.5rem * var(--dynamic-font-scale))', whiteSpace: 'pre-wrap' }}>
            Q. {currentQuiz.keyword}
          </div>
        </div>
        
        <div className="answer-section" style={{ background: 'transparent' }}>
          {!showResult ? (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%', padding: '1rem' }}>
              <button 
                onClick={() => handleAnswer('O')}
                style={{ flex: 1, padding: '1.5rem', fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(96,165,250,0.3)', borderRadius: '16px', cursor: 'pointer' }}
              >
                O
              </button>
              <button 
                onClick={() => handleAnswer('X')}
                style={{ flex: 1, padding: '1.5rem', fontSize: '2rem', fontWeight: 'bold', color: '#f87171', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(248,113,113,0.3)', borderRadius: '16px', cursor: 'pointer' }}
              >
                X
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isCorrect ? 'var(--success)' : '#f87171' }}>
                {isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
              </div>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                정답: <span style={{ color: currentQuiz.answer === 'O' ? '#60a5fa' : '#f87171', fontWeight: 'bold' }}>{currentQuiz.answer}</span>
              </div>
              <div className="info-card" style={{ width: '100%' }}>
                <div className="info-card-title">📖 해설</div>
                <div className="info-card-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {currentQuiz.content}
                </div>
              </div>
              
              <button 
                onClick={handleNext}
                style={{ marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                다음 문제 풀기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
