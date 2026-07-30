import './globals.css';
export const metadata = {
  title: 'Vocabulary App',
  description: 'Learn vocabulary effectively using Google Sheets',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
