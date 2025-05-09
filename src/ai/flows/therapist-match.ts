
'use server';

/**
 * @fileOverview A therapist matching AI agent.
 *
 * - matchTherapist - A function that handles the therapist matching process.
 * - MatchTherapistInput - The input type for the matchTherapist function.
 * - MatchTherapistOutput - The return type for the matchTherapist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchTherapistInputSchema = z.object({
  questionnaireAnswers: z
    .string()
    .describe('Detailed answers to the mental health needs questionnaire, including demographics, preferences, current state, and history.'),
});
export type MatchTherapistInput = z.infer<typeof MatchTherapistInputSchema>;

const MatchTherapistOutputSchema = z.object({
  therapistSuggestion: z
    .string()
    .describe('The type or specialization of therapist suggested for the student (e.g., "Un psychologue spécialisé en TCC et gestion du stress", "Un conseiller d\'orientation avec expérience en anxiété scolaire").'),
  reasoning:
    z.string()
    .describe('The detailed reasoning behind the therapist suggestion, referencing specific answers from the questionnaire.'),
  // Potentially add more fields here in the future, like suggested next steps.
});
export type MatchTherapistOutput = z.infer<typeof MatchTherapistOutputSchema>;

export async function matchTherapist(
  input: MatchTherapistInput
): Promise<MatchTherapistOutput> {
  return matchTherapistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchTherapistPrompt',
  input: {schema: MatchTherapistInputSchema},
  output: {schema: MatchTherapistOutputSchema},
  prompt: `You are an expert mental health professional specializing in matching students in Tunisia with suitable therapists based on their questionnaire answers.
Your goal is to provide a thoughtful and personalized therapist suggestion.

Please analyze the following student questionnaire answers:
{{{questionnaireAnswers}}}

Based on these answers, provide:
1.  **Therapist Suggestion**: Recommend a type of therapist or specialization that would be most beneficial. Be specific (e.g., "Un psychologue clinicien avec une expertise en troubles anxieux et dépressifs", "Un thérapeute TCC (Thérapie Comportementale et Cognitive) orienté vers la gestion du stress et l'amélioration de l'estime de soi", "Un conseiller en santé mentale pour étudiants pour l'exploration et le soutien général").
2.  **Reasoning**: Explain clearly and concisely why you are making this suggestion. Refer to specific information from the questionnaire to justify your choice. Highlight how the suggested therapist type aligns with the student's expressed needs, concerns, history, and preferences. For example, if they mention specific symptoms like anxiety and concentration issues, explain how the therapist type can help with those. If they have preferences for therapist expectations (e.g., "explore mon passé", "m'enseigne de nouvelles compétences"), mention how the suggested therapist might meet these. Consider their location (gouvernorat) if suggesting in-person options, though the primary focus is on the type of help needed.

IMPORTANT: Focus on suggesting the *type* of therapist and *why*, rather than a specific named individual. The platform will handle connecting them to actual therapists later.
Your response should be empathetic and supportive in tone.
Ensure the reasoning directly links back to the questionnaire data provided.
`,
});

const matchTherapistFlow = ai.defineFlow(
  {
    name: 'matchTherapistFlow',
    inputSchema: MatchTherapistInputSchema,
    outputSchema: MatchTherapistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a therapist suggestion.");
    }
    return output;
  }
);

