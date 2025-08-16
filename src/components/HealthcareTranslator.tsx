import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { translateText, speakText } from '@/utils/translationApi';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '@/data/languages';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';

export const HealthcareTranslator = () => {
  const [inputLanguage, setInputLanguage] = useState('en');
  const [outputLanguage, setOutputLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { toast } = useToast();

  const handleStartStopRecording = async () => {
    if (isListening) {
      stopListening();
      
      // If we have transcript, translate it
      if (transcript.trim()) {
        await handleTranslate(transcript);
      }
    } else {
      if (!isSupported) {
        toast({
          title: "Speech recognition not supported",
          description: "Your browser doesn't support speech recognition. Please try Chrome or Safari.",
          variant: "destructive",
        });
        return;
      }
      
      resetTranscript();
      setTranslatedText('');
      const inputLang = getLanguageByCode(inputLanguage);
      startListening(inputLang.speechCode);
    }
  };

  const handleTranslate = async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;

    setIsTranslating(true);
    try {
      const response = await translateText({
        text: textToTranslate.trim(),
        source_lang: inputLanguage,
        target_lang: outputLanguage,
      });
      
      setTranslatedText(response.translated_text);
      
      toast({
        title: "Translation complete",
        description: `Translated to ${getLanguageByCode(outputLanguage).name}`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "Please try again. Make sure the translation service is running.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakTranslation = () => {
    if (!translatedText.trim()) {
      toast({
        title: "No translation to speak",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    setIsSpeaking(true);
    const outputLang = getLanguageByCode(outputLanguage);
    
    try {
      // Get the utterance from speakText and add event handlers
      const utterance = speakText(translatedText, outputLang.speechCode);
      
      if (utterance) {
        // Safety timeout to reset button state if events don't fire
        const safetyTimeout = setTimeout(() => {
          setIsSpeaking(false);
        }, 10000); // 10 seconds timeout
        
        // Listen for speech end to reset button state
        utterance.onend = () => {
          clearTimeout(safetyTimeout);
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          clearTimeout(safetyTimeout);
          setIsSpeaking(false);
        };
        utterance.onpause = () => {
          clearTimeout(safetyTimeout);
          setIsSpeaking(false);
        };
        utterance.oncancel = () => {
          clearTimeout(safetyTimeout);
          setIsSpeaking(false);
        };
      } else {
        // If speech synthesis is not supported, reset immediately
        setIsSpeaking(false);
      }
      
      toast({
        title: "Speaking translation",
        description: `Reading in ${outputLang.name}`,
      });
    } catch (error) {
      setIsSpeaking(false);
      toast({
        title: "Speech failed",
        description: "Unable to speak the translation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft rounded-lg">
              <Languages className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Healthcare Translator
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Language Controls */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LanguageSelector
              label="Input Language"
              value={inputLanguage}
              onValueChange={setInputLanguage}
              languages={SUPPORTED_LANGUAGES}
            />
            <LanguageSelector
              label="Output Language"
              value={outputLanguage}
              onValueChange={setOutputLanguage}
              languages={SUPPORTED_LANGUAGES}
            />
          </div>
        </div>

        {/* Transcript Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TranscriptPanel
            title="Original Transcript"
            content={transcript}
            isListening={isListening}
          />
          <TranscriptPanel
            title="Translated Transcript"
            content={translatedText}
          />
        </div>

        {/* Control Buttons */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleStartStopRecording}
              variant={isListening ? "recording" : "medical"}
              size="xl"
              disabled={isTranslating}
              className="flex-1 sm:flex-none sm:min-w-48"
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Recording
                </>
              )}
            </Button>

            <Button
              onClick={handleSpeakTranslation}
              variant="secondary"
              size="xl"
              disabled={!translatedText || isTranslating}
              className="flex-1 sm:flex-none sm:min-w-48"
            >
              <Volume2 className="w-5 h-5" />
              {isSpeaking ? "Speaking..." : "Speak Translation"}
            </Button>
            
            {/* Manual reset button for stuck speaking state */}
            {isSpeaking && (
              <Button
                onClick={() => {
                  setIsSpeaking(false);
                  window.speechSynthesis.cancel();
                  toast({
                    title: "Speech stopped",
                    description: "Speech synthesis has been stopped.",
                  });
                }}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Stop Speaking
              </Button>
            )}
          </div>
          
          {isTranslating && (
            <div className="mt-3 text-center">
              <p className="text-sm text-muted-foreground">Translating...</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-primary-soft rounded-lg p-4 border border-primary/20">
          <h3 className="text-sm font-semibold text-primary mb-2">How to use:</h3>
          <ol className="text-sm text-primary space-y-1 list-decimal list-inside">
            <li>Select your input and output languages</li>
            <li>Click "Start Recording" and speak clearly</li>
            <li>Click "Stop Recording" to translate your speech</li>
            <li>Use "Speak Translation" to hear the translated text</li>
          </ol>
        </div>
      </main>
    </div>
  );
};