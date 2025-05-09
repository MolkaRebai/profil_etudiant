import { MoodTracker } from "@/components/mood-tracker";
import { Smile } from "lucide-react";

export default function MoodTrackerPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Smile className="mr-3 h-8 w-8 text-primary" />
          Suivi d'Humeur
        </h1>
        <p className="text-muted-foreground">Enregistrez et visualisez votre humeur au fil du temps.</p>
      </header>
      <MoodTracker />
    </div>
  );
}
