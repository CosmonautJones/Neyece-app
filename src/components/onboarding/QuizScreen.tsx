import type { QuizQuestion } from "@/lib/quiz-data";
import OptionPill from "./OptionPill";

interface QuizScreenProps {
  question: QuizQuestion;
  selections: string[];
  onToggle: (optionId: string) => void;
}

export default function QuizScreen({ question, selections, onToggle }: QuizScreenProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">{question.emoji}</div>
      <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-tight text-ink mb-2">
        {question.title}
      </h2>
      <p className="text-base text-brown font-bold mb-8 font-body">
        {question.subtitle}
      </p>
      <div className="flex flex-wrap justify-center gap-3 max-w-[560px] mx-auto">
        {question.options.map((option) => (
          <OptionPill
            key={option.id}
            label={option.label}
            emoji={option.emoji}
            selected={selections.includes(option.id)}
            onClick={() => onToggle(option.id)}
          />
        ))}
      </div>
      {question.minSelections > 0 && selections.length === 0 && (
        <p className="text-sm text-muted mt-4 font-body">
          Pick at least {question.minSelections}
        </p>
      )}
    </div>
  );
}
