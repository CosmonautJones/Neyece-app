import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-brutal-4 border-2 border-ink rounded-2xl",
            headerTitle: "font-display text-ink",
            headerSubtitle: "font-body text-muted",
            formButtonPrimary: "bg-coral hover:bg-coral/90 font-body font-bold",
            footerActionLink: "text-coral hover:text-coral/80 font-body",
          },
        }}
      />
    </div>
  );
}
