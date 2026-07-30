import { getVocabularyByTopic, getPaDataByTopic } from '@/lib/google';
import { getSubjectById } from '@/config/subjects';
import QuizApp from '@/components/QuizApp';
import PaHandyBook from '@/components/PaHandyBook';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function TopicPage({ params }) {
  const subjectId = params.subjectId;
  const subject = getSubjectById(subjectId);
  
  if (!subject) {
    notFound();
  }

  // params.topicId is URL encoded
  const topicName = decodeURIComponent(params.topicId);
  
  let content;
  if (subjectId === 'pa') {
    const paData = await getPaDataByTopic(subjectId, topicName);
    content = <PaHandyBook initialData={paData} topicName={topicName} />;
  } else {
    const vocabList = await getVocabularyByTopic(subjectId, topicName);
    content = <QuizApp initialVocab={vocabList} topicName={topicName} />;
  }

  return (
    <main className="container">
      <nav className="navbar">
        <Link href={`/subject/${subjectId}`} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Topics
        </Link>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          {subject.name} - {topicName}
        </h2>
      </nav>
      
      {content}
    </main>
  );
}

