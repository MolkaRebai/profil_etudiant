import { EmergencyContactCard } from "@/components/emergency-contact-card";
import { AlertTriangle, PhoneCall } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const emergencyContacts = [
  {
    name: "SAMU (Urgence Médicale)",
    phone: "15",
    description: "Pour les urgences médicales vitales en France.",
    availability: "24/7",
  },
  {
    name: "SOS Amitié",
    phone: "09 72 39 40 50",
    description: "Ligne d'écoute pour les personnes en détresse psychologique.",
    availability: "24/7",
    website: "https://www.sos-amitie.com",
  },
  {
    name: "Numéro National de Prévention du Suicide",
    phone: "3114",
    description: "Ligne d'écoute et d'orientation pour la prévention du suicide.",
    availability: "24/7",
  },
  {
    name: "Fil Santé Jeunes",
    phone: "3224 ou 01 44 93 30 74",
    description: "Écoute, information et orientation pour les jeunes (santé, mal-être, sexualité...).",
    availability: "Horaires variables, consulter le site",
    website: "https://www.filsantejeunes.com",
  },
   {
    name: "Police Secours",
    phone: "17",
    description: "En cas de danger immédiat pour vous-même ou autrui.",
    availability: "24/7",
  },
];

export default function EmergencyPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-10 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Support d'Urgence
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Si vous êtes en situation de crise ou avez besoin d'une aide immédiate, voici des ressources importantes.
        </p>
      </header>

      <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto">
        <PhoneCall className="h-5 w-5" />
        <AlertTitle className="font-semibold">En cas de danger immédiat</AlertTitle>
        <AlertDescription>
          Si vous ou quelqu'un que vous connaissez êtes en danger immédiat, veuillez contacter les services d'urgence de votre pays (par exemple, le <strong>15</strong> ou le <strong>112</strong> en France/Europe).
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyContacts.map((contact) => (
          <EmergencyContactCard
            key={contact.name}
            name={contact.name}
            phone={contact.phone}
            description={contact.description}
            availability={contact.availability}
            website={contact.website}
          />
        ))}
      </div>

       <div className="mt-12 text-center p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-2">Conseils en cas de crise</h2>
        <ul className="list-disc list-inside text-muted-foreground text-left max-w-md mx-auto space-y-1">
            <li>Ne restez pas seul(e). Parlez à un ami, un membre de votre famille ou un professionnel.</li>
            <li>Éloignez-vous de toute source de danger potentiel.</li>
            <li>Essayez de respirer profondément pour calmer votre anxiété.</li>
            <li>Si vous avez un plan de sécurité, suivez-le.</li>
        </ul>
      </div>
    </div>
  );
}
