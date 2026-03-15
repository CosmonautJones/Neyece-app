"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/onboarding/ProgressBar";
import QuizScreen from "@/components/onboarding/QuizScreen";
import CitySelect from "@/components/onboarding/CitySelect";
import { quizScreens, emptyAnswers, type QuizAnswers } from "@/lib/quiz-data";

/** Total steps = quiz screens + city selection */
const TOTAL_STEPS = quizScreens.length + 1;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [submitting, setSubmitting] = useState(false);

  const isCityStep = step === quizScreens.length;
  const currentQuestion = isCityStep ? null : quizScreens[step];

  const canProceed = isCityStep
    ? answers.city !== ""
    : currentQuestion
      ? answers[currentQuestion.id as keyof QuizAnswers].length >= currentQuestion.minSelections
      : false;

  const toggleOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      const key = currentQuestion.id as keyof Omit<QuizAnswers, "city">;
      setAnswers((prev) => {
        const current = prev[key] as string[];
        const updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [key]: updated };
      });
    },
    [currentQuestion],
  );

  const selectCity = useCallback((cityId: string) => {
    setAnswers((prev) => ({ ...prev, city: cityId }));
  }, []);

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (res.ok) {
        router.push("/discover");
      } else {
        console.error("Onboarding submission failed:", res.status);
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Onboarding submission error:", err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-xl font-bold text-ink">
            Neyece
          </span>
          <span className="text-sm text-muted font-body font-bold">
            Vibe Check
          </span>
        </div>
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </header>

      {/* Quiz content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div
          key={step}
          className={`w-full max-w-lg ${
            direction === "forward"
              ? "animate-[slideInRight_0.3s_ease-out]"
              : "animate-[slideInLeft_0.3s_ease-out]"
          }`}
        >
          {isCityStep ? (
            <CitySelect selected={answers.city} onSelect={selectCity} />
          ) : currentQuestion ? (
            <QuizScreen
              question={currentQuestion}
              selections={answers[currentQuestion.id as keyof QuizAnswers] as string[]}
              onToggle={toggleOption}
            />
          ) : null}
        </div>
      </main>

      {/* Navigation */}
      <footer className="px-6 pb-8 pt-2 max-w-lg mx-auto w-full">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 py-3.5 px-6 border-2 border-ink rounded-full font-body font-extrabold text-sm text-ink bg-white shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all"
            >
              Back
            </button>
          )}
          {isCityStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
              className={`flex-1 py-3.5 px-6 border-2 border-ink rounded-full font-body font-extrabold text-sm shadow-brutal-sm transition-all ${
                canProceed && !submitting
                  ? "bg-coral text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal cursor-pointer"
                  : "bg-cream-dark text-muted cursor-not-allowed"
              }`}
            >
              {submitting ? "Finding your spots..." : "Let's go! 🎯"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed}
              className={`flex-1 py-3.5 px-6 border-2 border-ink rounded-full font-body font-extrabold text-sm shadow-brutal-sm transition-all ${
                canProceed
                  ? "bg-coral text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal cursor-pointer"
                  : "bg-cream-dark text-muted cursor-not-allowed"
              }`}
            >
              Next
            </button>
          )}
        </div>

        {/* Skip deal-breakers hint */}
        {currentQuestion?.id === "dealbreakers" && answers.dealbreakers.length === 0 && (
          <p className="text-center text-sm text-muted mt-3 font-body">
            No deal-breakers? Just hit Next — we&apos;ll show you everything.
          </p>
        )}
      </footer>
    </div>
  );
}
