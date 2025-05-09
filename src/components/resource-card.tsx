import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  link: string;
}

export function ResourceCard({ title, description, imageUrl, imageHint, category, link }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            data-ai-hint={imageHint}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 flex-grow flex flex-col">
        <Badge variant="secondary" className="w-fit mb-2 bg-accent text-accent-foreground">{category}</Badge>
        <CardTitle className="text-xl font-semibold mb-2 leading-tight">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm flex-grow">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            Lire la suite
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
