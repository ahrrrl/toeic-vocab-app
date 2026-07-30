'use client';

import { useState } from 'react';
import PaSummaryBox from './PaSummaryBox';
import PaOxQuiz from './PaOxQuiz';

export default function PaHandyBook({ initialData, topicName }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'quiz'

  // Filter data based on type
  const summaryData = initialData.filter(item => item.type === '개념');
  const quizData = initialData.filter(item => item.type === 'OX');

  return (
    <div className="pa-handybook-container">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
          <button
            onClick={() => setActiveTab('summary')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: activeTab === 'summary' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'summary' ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            📋 요약집
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: activeTab === 'quiz' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'quiz' ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            ✅ O/X 퀴즈
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && <PaSummaryBox data={summaryData} />}
        {activeTab === 'quiz' && <PaOxQuiz data={quizData} />}
      </div>
    </div>
  );
}
