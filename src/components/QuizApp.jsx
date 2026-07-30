'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuizApp({ initialVocab }) {
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Randomize words on initial load
  useEffect(() => {
    if (initialVocab && initialVocab.length > 0) {
      const shuffled = [...initialVocab].sort(() => Math.random() - 0.5);
      setVocabList(shuffled);
    }
  }, [initialVocab]);

  if (!vocabList || vocabList.length === 0) {
    return (
      <div className="empty-state glass-card">
        <h2>No words found for this topic</h2>
        <Link href="/" className="btn-primary" style={{ display: 'inline-block' }}>Go Back</Link>
      </div>
    );
  }

  const currentWord = vocabList[currentIndex];

  const handleCardClick = (e) => {
    e.stopPropagation();
    handleNext();
  };

  const handleShowAnswerClick = (e) => {
    e.stopPropagation();
    if (!showAnswer) {
      setShowAnswer(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < vocabList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Re-shuffle when reached the end
      const reshuffled = [...vocabList].sort(() => Math.random() - 0.5);
      setVocabList(reshuffled);
      setCurrentIndex(0);
    }
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distanceY = touchStart.y - touchEnd.y;
    const distanceX = touchStart.x - touchEnd.x;
    
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrev();
      }
    }
  };

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
          Prev
        </button>
        <div className="progress-text" style={{ marginBottom: 0 }}>
          {currentIndex + 1} / {vocabList.length}
        </div>
        <button 
          onClick={handleNext} 
          className="icon-btn"
        >
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div 
        className="flashcard" 
        onTouchStart={onTouchStart} 
        onTouchMove={onTouchMove} 
        onTouchEnd={onTouchEndEvent}
      >
        <div className="word-section" onClick={handleCardClick} style={{ flexDirection: 'column' }}>
          <div className="word-display" style={{ whiteSpace: 'pre-wrap', marginBottom: currentWord.pronunciation ? '0.5rem' : '1rem' }}>
            {currentWord.word}
          </div>
          {currentWord.pronunciation && (
            <div className="pronunciation-display" style={{ fontSize: 'calc(1.1rem * var(--dynamic-font-scale))', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {currentWord.pronunciation}
            </div>
          )}
        </div>
        
        {showAnswer ? (
          <div className="answer-section" onClick={handleShowAnswerClick}>
            <div className="meaning-display" style={{ whiteSpace: 'pre-wrap' }}>{currentWord.meaning}</div>
            {currentWord.example && (
              <div className="example-display" style={{ whiteSpace: 'pre-wrap' }}>&quot;{currentWord.example}&quot;</div>
            )}
            
            {(currentWord.collocation || currentWord.paraphrasing) && (
              <div className="additional-info-grid">
                {currentWord.collocation && (
                  <div className="info-card" onClick={(e) => e.stopPropagation()}>
                    <div className="info-card-title title-collocation">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                      정답 자석 (Collocation)
                    </div>
                    <div className="info-card-content" style={{ whiteSpace: 'pre-wrap' }}>
                      {currentWord.collocation}
                    </div>
                  </div>
                )}
                
                {currentWord.paraphrasing && (
                  <div className="info-card" onClick={(e) => e.stopPropagation()}>
                    <div className="info-card-title title-paraphrasing">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      패러프레이징 (Paraphrasing)
                    </div>
                    <div className="info-card-content" style={{ whiteSpace: 'pre-wrap' }}>
                      {currentWord.paraphrasing}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="progress-text" style={{marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.7}}>
              <span className="desktop-hint">Click anywhere to go to the next word</span>
              <span className="mobile-hint">Swipe Left or Tap to go to the next word</span>
            </div>
          </div>
        ) : (
          <div className="hidden-answer" onClick={handleShowAnswerClick}>
            <span>Tap here to view the answer</span>
          </div>
        )}
      </div>
    </div>
  );
}
