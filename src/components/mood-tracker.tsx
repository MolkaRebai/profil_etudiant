"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, CalendarIcon, Edit2, PlusCircle, Trash2, TrendingUp } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import { Label } from "./ui/label";

interface MoodEntry {
  id: string;
  date: string; // ISO string format for date
  mood: MoodLevel;
  note?: string;
}

type MoodLevel = "Très bien" | "Bien" | "Neutre" | "Moins bien" | "Pas bien";

const moodOptions: { level: MoodLevel; emoji: string; color: string; value: number }[] = [
  { level: "Très bien", emoji: "😄", color: "text-green-500", value: 5 },
  { level: "Bien", emoji: "🙂", color: "text-lime-500", value: 4 },
  { level: "Neutre", emoji: "😐", color: "text-yellow-500", value: 3 },
  { level: "Moins bien", emoji: "😟", color: "text-orange-500", value: 2 },
  { level: "Pas bien", emoji: "😢", color: "text-red-500", value: 1 },
];

const moodValueMapping: Record<MoodLevel, number> = {
  "Très bien": 5,
  "Bien": 4,
  "Neutre": 3,
  "Moins bien": 2,
  "Pas bien": 1,
};

export function MoodTracker() {
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMood, setCurrentMood] = useState<MoodLevel | undefined>();
  const [note, setNote] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize selectedDate on client-side only to avoid hydration mismatch
    setSelectedDate(new Date());

    const storedMoodLog = localStorage.getItem("moodLog");
    if (storedMoodLog) {
      setMoodLog(JSON.parse(storedMoodLog));
    }
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    localStorage.setItem("moodLog", JSON.stringify(moodLog));
  }, [moodLog]);

  const handleAddOrUpdateMood = () => {
    if (!selectedDate || !currentMood) {
      // TODO: Add toast notification for error
      alert("Veuillez sélectionner une date et une humeur.");
      return;
    }

    const newEntry: MoodEntry = {
      id: editingEntryId || new Date().toISOString() + Math.random(), // Ensure unique ID
      date: selectedDate.toISOString(),
      mood: currentMood,
      note: note,
    };

    if (editingEntryId) {
      setMoodLog(moodLog.map(entry => entry.id === editingEntryId ? newEntry : entry));
      setEditingEntryId(null);
    } else {
       // Check if an entry for this date already exists
      const existingEntryIndex = moodLog.findIndex(entry => format(parseISO(entry.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));
      if (existingEntryIndex !== -1) {
        // Replace existing entry
        const updatedLog = [...moodLog];
        updatedLog[existingEntryIndex] = newEntry;
        setMoodLog(updatedLog);
      } else {
        setMoodLog([...moodLog, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }
    }
    
    // Reset form
    setCurrentMood(undefined);
    setNote("");
    setSelectedDate(new Date()); // Reset to today or keep selected? For now, reset.
  };

  const handleEditEntry = (entry: MoodEntry) => {
    setEditingEntryId(entry.id);
    setSelectedDate(parseISO(entry.date));
    setCurrentMood(entry.mood);
    setNote(entry.note || "");
  };

  const handleDeleteEntry = (id: string) => {
    setMoodLog(moodLog.filter(entry => entry.id !== id));
     if (editingEntryId === id) { // If deleting the entry being edited
      setEditingEntryId(null);
      setCurrentMood(undefined);
      setNote("");
      setSelectedDate(new Date());
    }
  };
  
  const chartData = useMemo(() => {
    return moodLog.map(entry => ({
      date: format(parseISO(entry.date), "dd/MM", { locale: fr }),
      moodValue: moodValueMapping[entry.mood],
      mood: entry.mood,
    })).slice(-30); // Show last 30 entries
  }, [moodLog]);

  const chartConfig = {
    moodValue: {
      label: "Humeur",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <PlusCircle className="mr-2 h-6 w-6 text-primary" />
            {editingEntryId ? "Modifier l'humeur" : "Enregistrer votre humeur"}
          </CardTitle>
          <CardDescription>
            Sélectionnez une date, votre humeur et ajoutez une note si vous le souhaitez.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="mood-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="mood-date"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal mt-1"
                  disabled={!selectedDate} // Disable button until date is loaded
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Chargement...</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Quelle est votre humeur ?</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {moodOptions.map(option => (
                <Button
                  key={option.level}
                  variant={currentMood === option.level ? "default" : "outline"}
                  onClick={() => setCurrentMood(option.level)}
                  className={`flex flex-col items-center justify-center h-20 p-2 text-xs ${currentMood === option.level ? 'border-primary border-2' : ''}`}
                  aria-label={option.level}
                >
                  <span className={`text-3xl ${option.color}`}>{option.emoji}</span>
                  {option.level}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="mood-note">Note (optionnel)</Label>
            <Textarea
              id="mood-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Quelques mots sur votre journée..."
              className="mt-1"
              rows={3}
            />
          </div>
          <Button onClick={handleAddOrUpdateMood} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {editingEntryId ? "Mettre à jour" : "Enregistrer l'humeur"}
          </Button>
          {editingEntryId && (
            <Button onClick={() => { setEditingEntryId(null); setCurrentMood(undefined); setNote(""); setSelectedDate(new Date());}} variant="outline" className="w-full mt-2">
              Annuler la modification
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-primary" />
              Historique de l'humeur
            </CardTitle>
            <CardDescription>Visualisez l'évolution de votre humeur sur les 30 derniers jours.</CardDescription>
          </CardHeader>
          <CardContent>
            {moodLog.length > 0 ? (
               <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[1, 2, 3, 4, 5]} 
                    tickFormatter={(value) => moodOptions.find(m => m.value === value)?.emoji || ''}
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="moodValue" fill="var(--color-moodValue)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">Aucune donnée d'humeur enregistrée pour le moment.</p>
            )}
          </CardContent>
        </Card>

        {moodLog.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Journal des humeurs</CardTitle>
            <CardDescription>Vos entrées d'humeur recentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {moodLog.slice().reverse().map(entry => {
                const moodInfo = moodOptions.find(m => m.level === entry.mood);
                return (
                  <li key={entry.id} className="p-3 border rounded-md flex justify-between items-start hover:bg-muted/50">
                    <div>
                      <p className="font-semibold">
                        {isValid(parseISO(entry.date)) ? format(parseISO(entry.date), "PPP", { locale: fr }) : "Date invalide"} - {" "}
                        <span className={moodInfo?.color}>{moodInfo?.emoji} {entry.mood}</span>
                      </p>
                      {entry.note && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{entry.note}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                       <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)} aria-label="Modifier">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)} aria-label="Supprimer">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
