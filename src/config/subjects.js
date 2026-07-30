export const SUBJECTS = [
  {
    id: 'toeic',
    name: '토익 (TOEIC)',
    description: '토익 필수 영단어 마스터',
    envKey: 'SPREADSHEET_ID_TOEIC',
  },
  {
    id: 'hanja',
    name: '한자 (Hanja)',
    description: '매일매일 한자 암기',
    envKey: 'SPREADSHEET_ID_HANJA',
  },
  {
    id: 'pa',
    name: '행정학 (Public Admin)',
    description: '공기업 행정학 핸디북',
    envKey: 'SPREADSHEET_ID_PA',
  }
];

export function getSubjectById(id) {
  return SUBJECTS.find(subject => subject.id === id);
}
