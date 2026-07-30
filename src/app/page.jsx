import Link from 'next/link';
import { SUBJECTS } from '@/config/subjects';
import FontSizeControl from '@/components/FontSizeControl';

export default function Home() {
  return (
    <main className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
      <div style={{ flexGrow: 1 }}>
        <h1>Vocabulary Mastery</h1>
        
        <div className="topic-grid">
          {SUBJECTS.map((subject) => (
            <Link key={subject.id} href={`/subject/${subject.id}`} className="glass-card topic-item">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{subject.name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                  {subject.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div style={{ 
        marginTop: '4rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          앱 설정 (App Settings)
        </div>
        <FontSizeControl />
      </div>
    </main>
  );
}
