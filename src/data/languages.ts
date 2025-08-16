export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', speechCode: 'en-US' },
  { code: 'es', name: 'Spanish', speechCode: 'es-ES' },
  { code: 'fr', name: 'French', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', speechCode: 'de-DE' },
  { code: 'it', name: 'Italian', speechCode: 'it-IT' },
  { code: 'pt', name: 'Portuguese', speechCode: 'pt-PT' },
  { code: 'ru', name: 'Russian', speechCode: 'ru-RU' },
  { code: 'ja', name: 'Japanese', speechCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', speechCode: 'ko-KR' },
  { code: 'zh', name: 'Chinese (Mandarin)', speechCode: 'zh-CN' },
  { code: 'ar', name: 'Arabic', speechCode: 'ar-SA' },
  { code: 'hi', name: 'Hindi', speechCode: 'hi-IN' },
];

export const getLanguageByCode = (code: string) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};