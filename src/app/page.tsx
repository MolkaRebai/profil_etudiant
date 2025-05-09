import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquare, Search, Activity, BookOpen, AlertTriangle, Brain, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <section className="text-center w-full max-w-3xl py-12 md:py-16">
        <Brain className="mx-auto h-20 w-20 text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Bienvenue sur Étudiant Bien-Être
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Votre espace dédié au soutien psychologique et au bien-être mental durant vos études.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/therapeute">Trouver un thérapeute</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/ressources">Explorer les ressources</Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground mb-8">Nos Fonctionnalités Clés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<User className="w-8 h-8 text-primary" />}
            title="Profil Étudiant & Messagerie"
            description="Gérez votre profil et communiquez de manière sécurisée avec votre thérapeute."
            link="/profil"
          />
          <FeatureCard
            icon={<Activity className="w-8 h-8 text-primary" />}
            title="Suivi d'Humeur"
            description="Enregistrez et visualisez l'évolution de votre humeur pour mieux vous comprendre."
            link="/humeur"
          />
          <FeatureCard
            icon={<Search className="w-8 h-8 text-primary" />}
            title="Recherche de Thérapeute"
            description="Notre IA vous aide à trouver le thérapeute le plus adapté à vos besoins."
            link="/therapeute"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-primary" />}
            title="Bibliothèque de Ressources"
            description="Accédez à des articles, guides et conseils pour votre santé mentale."
            link="/ressources"
          />
          <FeatureCard
            icon={<AlertTriangle className="w-8 h-8 text-accent" />}
            title="Support d'Urgence"
            description="Informations et contacts essentiels en cas de crise ou d'urgence."
            link="/urgence"
          />
           <FeatureCard
            icon={<MessageSquare className="w-8 h-8 text-primary" />}
            title="Messagerie Sécurisée"
            description="Communiquez en toute confidentialité avec les professionnels (Bientôt disponible)."
            link="/profil#messagerie"
            disabled
          />
        </div>
      </section>
      
      <section className="w-full max-w-4xl py-12 md:py-16">
          <Card className="shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src="https://picsum.photos/600/400?random=1"
                  alt="Personne trouvant du réconfort"
                  data-ai-hint="mental health support"
                  width={600}
                  height={400}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-foreground mb-3">Prêt à prendre soin de vous ?</h3>
                <p className="text-muted-foreground mb-6">
                  Créez votre compte ou explorez nos outils pour commencer votre parcours vers un meilleur bien-être.
                </p>
                <Button asChild className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/profil">Commencer Maintenant</Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>

    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  disabled?: boolean;
}

function FeatureCard({ icon, title, description, link, disabled }: FeatureCardProps) {
  const content = (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <div className="p-3 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold pt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardContent>
         {!disabled && (
          <Button variant="link" className="p-0 text-primary hover:text-primary/80" asChild>
            <Link href={link}>En savoir plus &rarr;</Link>
          </Button>
        )}
        {disabled && <p className="text-sm text-muted-foreground italic">Bientôt disponible</p>}
      </CardContent>
    </Card>
  );

  if (disabled) {
    return <div className="opacity-70">{content}</div>;
  }

  return <Link href={link} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg block h-full">{content}</Link>;
}
