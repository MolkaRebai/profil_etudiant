import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit3, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  // Placeholder data - in a real app, this would come from a database/auth
  const studentData = {
    name: "Alex Dupont",
    email: "alex.dupont@email.com",
    university: "Université de Paris",
    fieldOfStudy: "Informatique",
    year: "3ème année",
    avatarUrl: "https://picsum.photos/200/200?random=2",
    avatarFallback: "AD",
    bio: "Étudiant passionné par le développement web et l'intelligence artificielle. Cherche à maintenir un bon équilibre mental pendant mes études.",
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <User className="mr-3 h-8 w-8 text-primary" />
          Mon Profil Étudiant
        </h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et accédez à vos services.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Informations Personnelles</CardTitle>
              <CardDescription>Vos détails de profil.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={studentData.avatarUrl} alt={studentData.name} data-ai-hint="student avatar" />
                <AvatarFallback>{studentData.avatarFallback}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{studentData.name}</h2>
                <p className="text-muted-foreground">{studentData.email}</p>
              </div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="university">Université</Label>
                <Input id="university" value={studentData.university} readOnly className="mt-1 bg-muted/50"/>
              </div>
              <div>
                <Label htmlFor="fieldOfStudy">Domaine d'études</Label>
                <Input id="fieldOfStudy" value={studentData.fieldOfStudy} readOnly className="mt-1 bg-muted/50"/>
              </div>
              <div>
                <Label htmlFor="year">Année d'études</Label>
                <Input id="year" value={studentData.year} readOnly className="mt-1 bg-muted/50"/>
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" value={studentData.bio} readOnly rows={4} className="mt-1 bg-muted/50"/>
            </div>
          </CardContent>
        </Card>

        {/* Messaging Placeholder Card */}
        <Card id="messagerie" className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <MessageSquare className="mr-3 h-7 w-7 text-primary" />
              Messagerie Sécurisée
            </CardTitle>
            <CardDescription>Communiquez avec votre thérapeute.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center h-full space-y-4 py-10">
             <div className="p-4 bg-primary/10 rounded-full">
                <ShieldCheck className="h-12 w-12 text-primary" />
              </div>
            <p className="text-muted-foreground">
              La fonctionnalité de messagerie sera bientôt disponible. Elle vous permettra d'échanger en toute confidentialité avec les professionnels de santé.
            </p>
            <Button disabled variant="secondary">Accéder à la messagerie</Button>
             <p className="text-xs text-muted-foreground mt-2">
              (Nécessite une mise en relation avec un thérapeute)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
