import Link from 'next/link';
import { getTopics } from '@/lib/google';
import { getSubjectById } from '@/config/subjects';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function SubjectPage({ params }) {
  const subjectId = params.subjectId;
  const subject = getSubjectById(subjectId);
  
  if (!subject) {
    notFound();
  }

  const topics = await getTopics(subjectId);

  return (
    <main className="container">
      <nav className="navbar">
        <Link href="/" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{subject.name}</h2>
      </nav>

      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {subject.name} Topics
      </h1>
      
      {topics.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '2rem' }}>
          <h2>No Topics Found</h2>
          <p>Please check your Google Sheet connection and data.</p>
        </div>
      ) : (
        <div className="topic-grid">
          {topics.map((topic, index) => (
            <Link key={index} href={`/subject/${subjectId}/topic/${encodeURIComponent(topic)}`} className="glass-card topic-item">
              {topic}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
