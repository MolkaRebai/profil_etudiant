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
    .describe('Answers to the mental health needs questionnaire.'),
});
export type MatchTherapistInput = z.infer<typeof MatchTherapistInputSchema>;

const MatchTherapistOutputSchema = z.object({
  therapistSuggestion: z
    .string()
    .describe('The therapist suggested for the student.'),
  reasoning:
    z.string()
    .describe('The reasoning behind the therapist suggestion.'),
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
  prompt: `You are an expert mental health professional specializing in matching students with therapists.

You will use the student's answers to a questionnaire to determine the best therapist for them.

Student Questionnaire Answers: {{{questionnaireAnswers}}}

Based on the answers to the questionnaire, suggest a therapist and explain your reasoning.
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
    return output!;
  }
);
