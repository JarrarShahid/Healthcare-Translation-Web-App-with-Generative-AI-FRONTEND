import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptPanelProps {
  title: string;
  content: string;
  isListening?: boolean;
  className?: string;
}

export const TranscriptPanel = ({ title, content, isListening, className }: TranscriptPanelProps) => {
  return (
    <div className={`bg-transcript-bg border border-transcript-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-transcript-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          {title}
          {isListening && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-recording rounded-full animate-pulse"></div>
              <span className="text-xs text-recording">Recording</span>
            </div>
          )}
        </h3>
      </div>
      <ScrollArea className="h-32 md:h-40">
        <div className="p-4">
          {content ? (
            <p className="text-sm text-foreground leading-relaxed">{content}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {isListening ? "Listening..." : `No ${title.toLowerCase()} yet`}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};