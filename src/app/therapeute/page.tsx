import { TherapistFinderForm } from "@/components/therapist-finder-form";
import { Search } from "lucide-react";

export default function TherapistFinderPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8 text-center">
        <Search className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Trouver un Thérapeute
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Répondez à quelques questions pour nous aider à vous mettre en relation avec un thérapeute adapté à vos besoins.
        </p>
      </header>
      <TherapistFinderForm />
    </div>
  );
}
