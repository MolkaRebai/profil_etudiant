import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe, Clock } from "lucide-react";
import Link from "next/link";

interface EmergencyContactCardProps {
  name: string;
  phone: string;
  description: string;
  availability?: string;
  website?: string;
}

export function EmergencyContactCard({ name, phone, description, availability, website }: EmergencyContactCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-destructive">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
          <span className="font-mono text-lg text-primary">{phone}</span>
        </div>
        {availability && (
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">{availability}</span>
          </div>
        )}
        {website && (
           <div className="flex items-center">
            <Globe className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
            <Link href={website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
              {website.replace(/^https?:\/\//, '')}
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <a href={`tel:${phone.replace(/\s/g, '')}`}>
            <Phone className="mr-2 h-4 w-4" /> Appeler maintenant
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
