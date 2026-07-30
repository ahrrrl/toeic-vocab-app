import { google } from 'googleapis';
import { getSubjectById } from '@/config/subjects';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

async function getAuthClient() {
  if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
    console.warn('Google Sheets API credentials are not set. Using mock data.');
    return null;
  }
  
  const jwt = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    SCOPES
  );
  
  return jwt;
}

function getSpreadsheetId(subjectId) {
  const subject = getSubjectById(subjectId);
  if (!subject) return null;
  
  // Also fallback to GOOGLE_SPREADSHEET_ID for backwards compatibility if the new ones aren't set yet
  return process.env[subject.envKey] || process.env.GOOGLE_SPREADSHEET_ID;
}

export async function getTopics(subjectId) {
  const auth = await getAuthClient();
  const spreadsheetId = getSpreadsheetId(subjectId);
  
  if (!auth || !spreadsheetId) return ['Sample Day 1', 'Sample Day 2']; // Fallback

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    return response.data.sheets.map(sheet => sheet.properties.title);
  } catch (error) {
    console.error(`Error fetching topics for subject ${subjectId}:`, error);
    return [];
  }
}

export async function getVocabularyByTopic(subjectId, topicName) {
  const auth = await getAuthClient();
  const spreadsheetId = getSpreadsheetId(subjectId);
  
  if (!auth || !spreadsheetId) {
    // Mock data
    return [
      { word: 'Accommodate', meaning: '수용하다, 숙박시키다', example: 'The hotel can accommodate 500 guests.', collocation: 'accommodate + guests/needs', paraphrasing: 'accommodate -> hold / contain', pronunciation: '[어코모데이트]', partOfSpeech: '동사' },
      { word: 'Implement', meaning: '시행하다, 구현하다', example: 'We will implement the new policy next week.', collocation: 'implement + policy/plan', paraphrasing: 'implement -> carry out / execute', pronunciation: '[임플리먼트]', partOfSpeech: '동사' },
      { word: 'Significant', meaning: '상당한, 중요한', example: 'There has been a significant increase in sales.', collocation: 'significant + increase/impact', paraphrasing: 'significant -> substantial / important', pronunciation: '[시그니피컨트]', partOfSpeech: '형용사' }
    ];
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      // Assuming headers are in row 1, data starts from row 2
      range: `'${topicName}'!A2:G`, 
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    return rows.map(row => ({
      word: row[0] || '',
      meaning: row[1] || '',
      example: row[2] || '',
      collocation: row[3] || '',
      paraphrasing: row[4] || '',
      pronunciation: row[5] || '',
      partOfSpeech: row[6] || '',
    })).filter(item => item.word);
  } catch (error) {
    console.error(`Error fetching vocab for subject ${subjectId}, topic ${topicName}:`, error);
    return [];
  }
}

export async function getPaDataByTopic(subjectId, topicName) {
  const auth = await getAuthClient();
  const spreadsheetId = getSpreadsheetId(subjectId);
  
  if (!auth || !spreadsheetId) {
    // Mock data for PA
    return [
      { type: '개념', chapter: '정책결정', subChapter: '의사결정 모형', keyword: '쓰레기통 모형', content: '우연한 기회에 의해... [합리성]을 부인한다.', answer: '' },
      { type: '개념', chapter: '정책결정', subChapter: '의사결정 모형', keyword: '점증 모형', content: '기존 정책을 약간 수정하는 [보수적] 성향.', answer: '' },
      { type: '개념', chapter: '정책결정', subChapter: '권력 모형', keyword: '다원주의', content: '다양한 집단이 [경쟁]을 통해 결정한다.', answer: '' },
      { type: 'OX', chapter: '정책결정', subChapter: '의사결정 모형', keyword: '쓰레기통 모형은 고도의 합리성을 전제로 한다.', content: '쓰레기통 모형은 합리성을 부정하고 우연성을 강조한다.', answer: 'X' },
      { type: 'OX', chapter: '정책평가', subChapter: '총괄 평가', keyword: '총괄평가는 정책이 끝난 후 한다.', content: '총괄 평가는 정책 종료 후 그 효과를 판단하기 위해 실시한다.', answer: 'O' }
    ];
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      // Assuming headers are in row 1, data starts from row 2. A to F columns.
      range: `'${topicName}'!A2:F`, 
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    return rows.map(row => ({
      type: row[0] || '',
      chapter: row[1] || '',
      subChapter: row[2] || '',
      keyword: row[3] || '',
      content: row[4] || '',
      answer: row[5] || '',
    })).filter(item => item.type && item.chapter);
  } catch (error) {
    console.error(`Error fetching PA data for subject ${subjectId}, topic ${topicName}:`, error);
    return [];
  }
}
