
"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, UserCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const tunisianGovernorates = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan",
  "Kasserine", "Kébili", "Le Kef", "Mahdia", "Manouba", "Médenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
] as const;

const therapyInterestOptions = [
  { id: "stress", label: "Gestion du stress" },
  { id: "anxiety", label: "Anxiété" },
  { id: "depression", label: "Dépression" },
  { id: "relationships", label: "Relations personnelles" },
  { id: "self-esteem", label: "Estime de soi" },
  { id: "trauma", label: "J'ai vécu un traumatisme" },
  { id: "explore", label: "J'explore simplement" },
  { id: "autre", label: "Autre" },
] as const;

const therapistExpectationOptions = [
  { id: "listens", label: "Écoute activement" },
  { id: "explores", label: "Explore mon passé" },
  { id: "skills", label: "M'enseigne de nouvelles compétences" },
  { id: "challenges", label: "Remet en question mes croyances" },
  { id: "homework", label: "Donne des exercices à faire" },
  { id: "goals", label: "M'aide à fixer des objectifs" },
  { id: "checkins", label: "Fait des suivis proactifs" },
  { id: "other", label: "Autre" },
  { id: "dontknow", label: "Je ne sais pas" },
] as const;

const usefulResourceOptions = [
  { id: "consultation", label: "Consultation individuelle" },
  { id: "groupe", label: "Thérapie de groupe" },
  { id: "online", label: "Ressources en ligne" },
  { id: "suivi", label: "Suivi d'objectifs/habitudes" },
  { id: "webinaires", label: "Webinaires éducatifs" },
  { id: "autre-ressource", label: "Autre" },
  { id: "inconnu", label: "Je ne sais pas" },
] as const;

const frequencyOptions = ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"] as const;
const yesNoOptions = ["Oui", "Non"] as const;
const physicalEatingSleepOptions = ["Bon", "Moyen", "Mauvais"] as const; // For physical state
const eatingSleepHabitsOptions = ["Bonnes", "Moyennes", "Mauvaises"] as const; // For eating/sleep habits


const questionnaireSchema = z.object({
  governorate: z.enum(tunisianGovernorates, { required_error: "Veuillez sélectionner votre gouvernorat." }),
  gender: z.enum(["femme", "homme"], { required_error: "Veuillez sélectionner votre sexe." }),
  age: z.coerce.number().min(12, "L'âge doit être d'au moins 12 ans.").max(120, "L'âge ne peut pas dépasser 120 ans."),
  previousTherapy: z.enum(["yes", "no"], { required_error: "Veuillez indiquer si vous avez déjà suivi une thérapie." }),
  therapyInterests: z.array(z.string()).refine((value) => value.length > 0, { message: "Veuillez sélectionner au moins un centre d'intérêt." }),
  therapistExpectations: z.array(z.string()).refine((value) => value.length > 0, { message: "Veuillez sélectionner au moins une attente." }),
  physicalState: z.enum(physicalEatingSleepOptions, { required_error: "Veuillez évaluer votre état physique." }),
  eatingHabits: z.enum(eatingSleepHabitsOptions, { required_error: "Veuillez évaluer vos habitudes alimentaires." }),
  currentDepression: z.enum(yesNoOptions, { required_error: "Veuillez répondre à cette question sur la dépression." }),
  fatigueLevel: z.enum(frequencyOptions, { required_error: "Veuillez indiquer votre niveau de fatigue." }),
  selfEsteemIssues: z.enum(frequencyOptions, { required_error: "Veuillez répondre à cette question sur l'estime de soi." }),
  concentrationIssues: z.enum(frequencyOptions, { required_error: "Veuillez répondre à cette question sur la concentration." }),
  suicidalThoughtsCurrent: z.enum(frequencyOptions, { required_error: "Veuillez répondre à cette question sur les pensées suicidaires." }),
  suicidalThoughtsHistory: z.enum(["oui", "non"], { required_error: "Veuillez indiquer si vous avez déjà eu des pensées suicidaires." }),
  suicidalThoughtsLastTime: z.string().optional(),
  currentAnxiety: z.enum(yesNoOptions, { required_error: "Veuillez répondre à cette question sur l'anxiété." }),
  currentMedication: z.enum(yesNoOptions, { required_error: "Veuillez indiquer si vous prenez des médicaments." }),
  sleepHabits: z.enum(eatingSleepHabitsOptions, { required_error: "Veuillez évaluer vos habitudes de sommeil." }),
  usefulResources: z.array(z.string()).refine((value) => value.length > 0, { message: "Veuillez sélectionner au moins une ressource utile." }),
  communicationPreference: z.enum(["présentiel", "vidéo", "appel", "mixte", "pas de préférence"], { required_error: "Veuillez sélectionner votre mode de communication préféré." }),
  
  // Existing fields
  emotionalState: z.string().min(10, { message: "Veuillez décrire votre état émotionnel (minimum 10 caractères)."}).max(1000),
  symptoms: z.string().max(1000).optional().describe("Symptômes spécifiques rencontrés."),
  impactOnDailyLife: z.enum(["Pas du tout", "Un peu", "Modérément", "Considérablement", "Sévèrement"], { required_error: "Veuillez sélectionner l'impact sur votre vie quotidienne." }),
  therapyGoals: z.string().min(10, { message: "Veuillez décrire vos objectifs thérapeutiques (minimum 10 caractères)." }).max(1000),
  urgency: z.enum(["Pas urgent", "Bientôt", "Dès que possible"], { required_error: "Veuillez indiquer l'urgence de votre besoin." }),
  therapistPreferences: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  if (data.suicidalThoughtsHistory === "oui" && !data.suicidalThoughtsLastTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ce champ est requis si vous avez déjà eu des pensées suicidaires.",
      path: ["suicidalThoughtsLastTime"],
    });
  }
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

export function TherapistFinderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [therapistSuggestion, setTherapistSuggestion] = useState<MatchTherapistOutput | null>(null);

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      governorate: undefined,
      gender: undefined,
      age: undefined,
      previousTherapy: undefined,
      therapyInterests: [],
      therapistExpectations: [],
      physicalState: undefined,
      eatingHabits: undefined,
      currentDepression: undefined,
      fatigueLevel: undefined,
      selfEsteemIssues: undefined,
      concentrationIssues: undefined,
      suicidalThoughtsCurrent: undefined,
      suicidalThoughtsHistory: undefined,
      suicidalThoughtsLastTime: undefined,
      currentAnxiety: undefined,
      currentMedication: undefined,
      sleepHabits: undefined,
      usefulResources: [],
      communicationPreference: undefined,
      // Existing
      emotionalState: "",
      symptoms: "",
      impactOnDailyLife: undefined,
      therapyGoals: "",
      urgency: undefined,
      therapistPreferences: "",
    },
  });

  const watchedSuicidalHistory = form.watch("suicidalThoughtsHistory");

  useEffect(() => {
    if (watchedSuicidalHistory === "non") {
      form.setValue("suicidalThoughtsLastTime", undefined);
      form.clearErrors("suicidalThoughtsLastTime");
    }
  }, [watchedSuicidalHistory, form]);


  async function onSubmit(values: QuestionnaireFormValues) {
    setIsLoading(true);
    setError(null);
    setTherapistSuggestion(null);

    const questionnaireAnswers = `
      Informations Démographiques:
      - Gouvernorat: ${values.governorate}
      - Sexe: ${values.gender}
      - Âge: ${values.age}

      Expérience et Préférences Thérapeutiques:
      - Consultation antérieure d'un thérapeute: ${values.previousTherapy === "yes" ? "Oui" : "Non"}
      - Principaux centres d'intérêt pour cette thérapie: ${values.therapyInterests.join(", ") || "Non spécifié"}
      - Attentes envers le thérapeute: ${values.therapistExpectations.join(", ") || "Non spécifié"}
      - Objectifs thérapeutiques (texte libre): ${values.therapyGoals}
      - Préférences pour le thérapeute (texte libre): ${values.therapistPreferences || "Aucune"}
      - Mode de communication préféré: ${values.communicationPreference}
      - Urgence du besoin: ${values.urgency}

      État Actuel et Symptômes:
      - État physique actuel: ${values.physicalState}
      - Habitudes alimentaires actuelles: ${values.eatingHabits}
      - Habitudes de sommeil actuelles: ${values.sleepHabits}
      - Dépression, tristesse, chagrin accablant actuellement: ${values.currentDepression}
      - Fatigue ou manque d'énergie: ${values.fatigueLevel}
      - Mauvaise estime de soi / sentiment d'échec: ${values.selfEsteemIssues}
      - Difficultés de concentration: ${values.concentrationIssues}
      - Pensées suicidaires ou de se faire du mal actuellement: ${values.suicidalThoughtsCurrent}
      - Historique de pensées suicidaires: ${values.suicidalThoughtsHistory}
      ${values.suicidalThoughtsHistory === "oui" ? `- Dernière fois des pensées suicidaires: ${values.suicidalThoughtsLastTime}` : ""}
      - Anxiété, crises de panique ou phobies actuellement: ${values.currentAnxiety}
      - Traitement médicamenteux actuel: ${values.currentMedication}
      - État émotionnel général récent (texte libre): ${values.emotionalState}
      - Symptômes spécifiques rencontrés (texte libre): ${values.symptoms || "Non spécifié"}
      - Impact sur la vie quotidienne: ${values.impactOnDailyLife}

      Ressources et Support:
      - Ressources utiles souhaitées: ${values.usefulResources.join(", ") || "Non spécifié"}
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

  const renderRadioGroup = (name: keyof QuestionnaireFormValues, label: string, options: readonly string[], description?: string, infoText?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value as string}
              className="flex flex-col space-y-2"
            >
              {options.map((option) => (
                <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option} />
                  </FormControl>
                  <FormLabel className="font-normal">{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {infoText && <FormDescription className="flex items-center gap-1 mt-1"><Info className="h-4 w-4 text-muted-foreground" /> {infoText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderCheckboxGroup = (name: keyof QuestionnaireFormValues, label: string, options: readonly {id: string, label: string}[]) => (
     <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{label}</FormLabel>
          </div>
          {options.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                  >
                    <FormControl>
                      <Checkbox
                        checked={(field.value as string[])?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value as string[] || [];
                          return checked
                            ? field.onChange([...currentValue, item.id])
                            : field.onChange(
                                currentValue.filter(
                                  (value) => value !== item.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );

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
          <CardContent className="space-y-8"> {/* Increased spacing between questions */}
            
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dans quel gouvernorat tunisien vous trouvez-vous ?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre gouvernorat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tunisianGovernorates.map(gov => <SelectItem key={gov} value={gov}>{gov}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex items-center gap-1 mt-1"><Info className="h-4 w-4 text-muted-foreground" /> Cette information nous aide à vous proposer des thérapeutes proches de chez vous.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderRadioGroup("gender", "Quel est votre sexe?", ["femme", "homme"], undefined, "Le genre joue un rôle important dans la formation de l'identité personnelle et des expériences. Cette information aidera votre thérapeute à créer une approche plus personnalisée.")}
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quel est votre âge?</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Entrez votre âge" {...field} onChange={event => field.onChange(+event.target.value)} />
                  </FormControl>
                  <FormDescription className="flex items-center gap-1 mt-1"><Info className="h-4 w-4 text-muted-foreground" /> Saviez-vous que selon l'enquête Multiple Indicator Cluster Survey (MICS6) de 2018, presque 20% des jeunes tunisiens souffrent d'anxiété et environ 5% de dépression.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderRadioGroup("previousTherapy", "Avez-vous déjà consulté un thérapeute auparavant ?", ["yes", "no"], undefined, "Cette information nous aide à adapter notre approche à votre expérience préalable.")}

            {renderCheckboxGroup("therapyInterests", "Quels sont vos principaux centres d'intérêt pour cette thérapie ? (Plusieurs choix possibles)", therapyInterestOptions)}

            {renderCheckboxGroup("therapistExpectations", "Quelles sont vos attentes envers votre thérapeute ?", therapistExpectationOptions)}
            
            {renderRadioGroup("physicalState", "Comment évaluez-vous votre état physique actuel ?", physicalEatingSleepOptions, undefined, "Des études montrent que l'exercice physique peut aider contre la dépression aussi efficacement que les médicaments antidépresseurs. (Psychosomatic Medicine, 2007)")}

            {renderRadioGroup("eatingHabits", "Comment évaluez-vous vos habitudes alimentaires actuelles ?", eatingSleepHabitsOptions)}
            
            {renderRadioGroup("currentDepression", "Ressentez-vous actuellement une dépression, une tristesse ou un chagrin accablant ?", yesNoOptions)}
            
            {renderRadioGroup("fatigueLevel", "Ressentez-vous de la fatigue ou un manque d'énergie ?", frequencyOptions)}

            {renderRadioGroup("selfEsteemIssues", "Vous sentez-vous mal dans votre peau ou avez-vous l'impression d'être un échec ou d'avoir déçu votre famille ou vous-même ?", frequencyOptions)}

            {renderRadioGroup("concentrationIssues", "Avez-vous des difficultés à vous concentrer sur des activités, comme lire le journal ou regarder la télévision ?", frequencyOptions)}

            {renderRadioGroup("suicidalThoughtsCurrent", "Avez-vous des pensées selon lesquelles vous seriez mieux mort(e) ou où vous envisageriez de vous faire du mal ?", frequencyOptions)}

            {renderRadioGroup("suicidalThoughtsHistory", "Avez-vous déjà eu des pensées suicidaires ?", ["oui", "non"])}

            {watchedSuicidalHistory === 'oui' && (
               renderRadioGroup("suicidalThoughtsLastTime", "Si oui, quand était la dernière fois ?", ["Il y a plus d'un an", "Il y a plus de 3 mois", "Il y a plus d'un mois", "Il y a plus de 2 semaines"])
            )}

            {renderRadioGroup("currentAnxiety", "Ressentez-vous actuellement de l'anxiété, des crises de panique ou des phobies ?", yesNoOptions)}
            
            {renderRadioGroup("currentMedication", "Prenez-vous actuellement un traitement médicamenteux ?", yesNoOptions)}

            {renderRadioGroup("sleepHabits", "Comment évaluez-vous vos habitudes de sommeil actuelles ?", eatingSleepHabitsOptions, undefined, "L'ISI (Indice de Sévérité de l'Insomnie) a révélé que 72,2 % des étudiants souffraient d'insomnie.")}

            {renderCheckboxGroup("usefulResources", "Parmi les ressources suivantes, lesquelles vous seraient utiles ?", usefulResourceOptions)}

            {renderRadioGroup("communicationPreference", "Quel est votre mode de communication préféré avec votre thérapeute ?", ["présentiel", "vidéo", "appel", "mixte", "pas de préférence"])}

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
              name="therapyGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qu'espérez-vous accomplir avec la thérapie (objectifs personnels) ?</FormLabel>
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
                  <FormLabel>Avez-vous des préférences spécifiques pour un thérapeute (optionnel) ?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: genre du thérapeute, approches thérapeutiques spécifiques (TCC, psychanalyse), etc." {...field} />
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

