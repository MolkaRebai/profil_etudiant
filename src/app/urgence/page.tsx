import { EmergencyContactCard } from "@/components/emergency-contact-card";
import { AlertTriangle, PhoneCall } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const emergencyContacts = [
  {
    name: "SAMU (Urgence Médicale)",
    phone: "190",
    description: "Pour les urgences médicales vitales en Tunisie.",
    availability: "24/7",
  },
  {
    name: "Police Secours",
    phone: "197",
    description: "En cas de danger immédiat pour vous-même ou autrui.",
    availability: "24/7",
  },
  {
    name: "Protection Civile (Pompiers)",
    phone: "198",
    description: "Pour les incendies, accidents et autres urgences nécessitant une intervention des pompiers.",
    availability: "24/7",
  },
  {
    name: "SOS Médecins Tunisie",
    phone: "71 840 840", // Example number, verify actual SOS Médecins number for Tunisia if available
    description: "Service de médecins à domicile pour les urgences non vitales.",
    availability: "Horaires variables, vérifier disponibilité",
    website: "https://www.sosmedecins.tn/", // Example, verify actual website
  },
  {
    name: "Ligne d'Écoute Psychologique (si disponible)",
    phone: "Numéro à vérifier", // Placeholder, research actual Tunisian helplines
    description: "Soutien psychologique pour les personnes en détresse.",
    availability: "À vérifier",
  },
];

export default function EmergencyPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-10 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Support d'Urgence en Tunisie
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Si vous êtes en situation de crise ou avez besoin d'une aide immédiate, voici des ressources importantes en Tunisie.
        </p>
      </header>

      <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto">
        <PhoneCall className="h-5 w-5" />
        <AlertTitle className="font-semibold">En cas de danger immédiat</AlertTitle>
        <AlertDescription>
          Si vous ou quelqu'un que vous connaissez êtes en danger immédiat, veuillez contacter les services d'urgence tunisiens : <strong>SAMU (190)</strong>, <strong>Police (197)</strong>, ou <strong>Protection Civile (198)</strong>.
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
