import { ResourceCard } from "@/components/resource-card";
import { Library } from "lucide-react";

const resources = [
  {
    title: "Comprendre l'Anxiété",
    description: "Un guide complet pour identifier, comprendre et gérer les troubles anxieux.",
    imageUrl: "https://picsum.photos/400/250?random=3",
    imageHint: "calm person",
    category: "Articles",
    link: "#", // Placeholder link
  },
  {
    title: "Conseils pour un Meilleur Sommeil",
    description: "Des stratégies pratiques pour améliorer la qualité de votre sommeil et combattre l'insomnie.",
    imageUrl: "https://picsum.photos/400/250?random=4",
    imageHint: "peaceful sleep",
    category: "Guides",
    link: "#",
  },
  {
    title: "Gérer le Stress des Examens",
    description: "Techniques de relaxation et d'organisation pour aborder les périodes d'examens sereinement.",
    imageUrl: "https://picsum.photos/400/250?random=5",
    imageHint: "student studying",
    category: "Articles",
    link: "#",
  },
  {
    title: "Introduction à la Pleine Conscience",
    description: "Découvrez les bases de la méditation de pleine conscience et ses bienfaits pour la santé mentale.",
    imageUrl: "https://picsum.photos/400/250?random=6",
    imageHint: "meditation nature",
    category: "Guides",
    link: "#",
  },
  {
    title: "L'Importance de l'Activité Physique",
    description: "Comment l'exercice physique peut positivement impacter votre humeur et votre bien-être général.",
    imageUrl: "https://picsum.photos/400/250?random=7",
    imageHint: "person exercising",
    category: "Conseils",
    link: "#",
  },
  {
    title: "Maintenir des Relations Sociales Saines",
    description: "Conseils pour cultiver des amitiés et des relations enrichissantes pendant vos études.",
    imageUrl: "https://picsum.photos/400/250?random=8",
    imageHint: "friends talking",
    category: "Conseils",
    link: "#",
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-10 text-center">
        <Library className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Bibliothèque de Ressources
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explorez nos articles, guides et conseils pour cultiver votre bien-être mental et émotionnel.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.title}
            title={resource.title}
            description={resource.description}
            imageUrl={resource.imageUrl}
            imageHint={resource.imageHint}
            category={resource.category}
            link={resource.link}
          />
        ))}
      </div>
    </div>
  );
}
