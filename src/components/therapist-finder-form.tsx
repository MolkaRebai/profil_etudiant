"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { matchTherapist, type MatchTherapistOutput } from "@/ai/flows/therapist-match";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles, UserCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const questionnaireSchema = z.object({
  mainConcerns: z.string().min(10, { message: "Veuillez décrire vos préoccupations principales (minimum 10 caractères)." }).max(1000),
  emotionalState: z.string().min(10, { message: "Veuillez décrire votre état émotionnel (minimum 10 caractères)."}).max(1000),
  symptoms: z.string().max(1000).optional().describe("Symptômes spécifiques rencontrés."),
  impactOnDailyLife: z.enum(["Pas du tout", "Un peu", "Modérément", "Considérablement", "Sévèrement"], { required_error: "Veuillez sélectionner l'impact sur votre vie quotidienne." }),
  previousTherapy: z.enum(["yes", "no"], { required_error: "Veuillez indiquer si vous avez déjà suivi une thérapie." }),
  therapyGoals: z.string().min(10, { message: "Veuillez décrire vos objectifs thérapeutiques (minimum 10 caractères)." }).max(1000),
  urgency: z.enum(["Pas urgent", "Bientôt", "Dès que possible"], { required_error: "Veuillez indiquer l'urgence de votre besoin." }),
  therapistPreferences: z.string().max(500).optional(),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

export function TherapistFinderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [therapistSuggestion, setTherapistSuggestion] = useState<MatchTherapistOutput | null>(null);

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      mainConcerns: "",
      emotionalState: "",
      symptoms: "",
      impactOnDailyLife: undefined,
      previousTherapy: undefined,
      therapyGoals: "",
      urgency: undefined,
      therapistPreferences: "",
    },
  });

  async function onSubmit(values: QuestionnaireFormValues) {
    setIsLoading(true);
    setError(null);
    setTherapistSuggestion(null);

    const questionnaireAnswers = `
      Préoccupations principales: ${values.mainConcerns}
      État émotionnel général récent: ${values.emotionalState}
      Symptômes spécifiques (tristesse, angoisse, sommeil, etc.): ${values.symptoms || "Non spécifié"}
      Impact sur la vie quotidienne (études, social, activités): ${values.impactOnDailyLife}
      Thérapie antérieure: ${values.previousTherapy === "yes" ? "Oui" : "Non"}
      Objectifs thérapeutiques: ${values.therapyGoals}
      Urgence du besoin de parler: ${values.urgency}
      Préférences pour le thérapeute: ${values.therapistPreferences || "Aucune"}
    `;

    try {
      const result = await matchTherapist({ questionnaireAnswers });
      setTherapistSuggestion(result);
    } catch (err) {
      console.error("Error matching therapist:", err);
      setError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Recherche du thérapeute idéal en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => setError(null)} className="mt-4">Réessayer</Button>
      </Alert>
    );
  }

  if (therapistSuggestion) {
    return (
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <UserCheck className="mx-auto h-12 w-12 text-positive-green mb-3" />
          <CardTitle className="text-2xl">Suggestion de Thérapeute</CardTitle>
          <CardDescription>Basé sur vos réponses, voici une suggestion :</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border bg-secondary/30 rounded-md">
            <h3 className="font-semibold text-lg text-primary">{therapistSuggestion.therapistSuggestion}</h3>
          </div>
          <div>
            <h4 className="font-medium text-md text-foreground mb-1">Raisonnement :</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{therapistSuggestion.reasoning}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <p className="text-sm text-muted-foreground text-center">Ceci est une suggestion générée par IA. Nous vous encourageons à faire vos propres recherches et à contacter le professionnel pour plus d'informations.</p>
          <Button onClick={() => { setTherapistSuggestion(null); form.reset(); }} className="w-full">
            Remplir un nouveau questionnaire
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-accent" />
          Questionnaire
        </CardTitle>
        <CardDescription>Vos réponses nous aideront à personnaliser nos suggestions.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="mainConcerns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quelles sont vos préoccupations principales actuellement ?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: anxiété liée aux examens, difficultés relationnelles, stress..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emotionalState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment décririez-vous votre état émotionnel général récent ?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: plutôt calme, souvent triste, irritable, etc." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Éprouvez-vous des symptômes spécifiques (optionnel) ?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: tristesse persistante, crises d'angoisse, troubles du sommeil, perte d'intérêt, difficultés de concentration..." {...field} rows={3} />
                  </FormControl>
                  <FormDescription>Si oui, lesquels ? Sinon, laissez vide.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impactOnDailyLife"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Dans quelle mesure ces préoccupations affectent-elles vos études, votre vie sociale ou vos activités quotidiennes ?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {(["Pas du tout", "Un peu", "Modérément", "Considérablement", "Sévèrement"] as const).map((level) => (
                        <FormItem key={level} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={level} />
                          </FormControl>
                          <FormLabel className="font-normal">{level}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousTherapy"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Avez-vous déjà suivi une thérapie ?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Oui</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">Non</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="therapyGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qu'espérez-vous accomplir avec la thérapie ?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: mieux gérer mon stress, améliorer ma confiance en moi, surmonter une période difficile..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Avec quelle urgence estimez-vous avoir besoin de parler à quelqu'un ?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {(["Pas urgent", "Bientôt", "Dès que possible"] as const).map((level) => (
                        <FormItem key={level} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={level} />
                          </FormControl>
                          <FormLabel className="font-normal">{level}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="therapistPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avez-vous des préférences pour un thérapeute (optionnel) ?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: genre, spécialité, approche thérapeutique..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Si vous n'avez pas de préférences, laissez ce champ vide.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                "Obtenir une suggestion"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
