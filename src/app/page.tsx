import {
  Navbar,
  Hero,
  Marquee,
  HowItWorks,
  ProblemSolution,
  QuizPreview,
  SocialProof,
  CityShowcase,
  BottomCta,
  Footer,
  RevealOnScroll,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <RevealOnScroll>
        <HowItWorks />
      </RevealOnScroll>
      <RevealOnScroll>
        <ProblemSolution />
      </RevealOnScroll>
      <RevealOnScroll>
        <QuizPreview />
      </RevealOnScroll>
      <RevealOnScroll>
        <SocialProof />
      </RevealOnScroll>
      <RevealOnScroll>
        <CityShowcase />
      </RevealOnScroll>
      <BottomCta />
      <Footer />
    </>
  );
}
