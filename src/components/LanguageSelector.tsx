import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  languages: { code: string; name: string }[];
}

export const LanguageSelector = ({ label, value, onValueChange, languages }: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={label} className="bg-white border-border hover:border-primary focus:border-primary">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-white border-border shadow-lg">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code} className="hover:bg-accent focus:bg-accent">
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};