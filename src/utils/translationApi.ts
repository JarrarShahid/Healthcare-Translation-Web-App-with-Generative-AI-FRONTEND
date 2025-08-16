export interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}

export interface TranslationResponse {
  translated_text: string;
}

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    console.log('🚀 Starting translation request...');
    console.log('📤 Request data:', request);
    console.log('🌐 Target URL:', 'https://web-production-707fbe.up.railway.app/translate');
    
    const response = await fetch('https://web-production-707fbe.up.railway.app/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('📥 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Translation successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Translation API error:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      type: error.constructor.name
    });
    throw error;
  }
};

export const speakText = (text: string, language: string = 'en-US'): SpeechSynthesisUtterance | null => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Slightly slower for medical clarity
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
    return utterance;
  } else {
    console.warn('Speech synthesis not supported in this browser');
    return null;
  }
};