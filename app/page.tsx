"use client";

import { useState, useEffect } from "react";
import { HabitGrid } from "@/components/habit-grid";
import { WeeklyReport } from "@/components/weekly-report"; // Import the new component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { addWeeks, subWeeks } from "date-fns";

// Export types so other components can use them
export interface Habit {
  id: number;
  text: string;
}

export interface DailyProgress {
  [date: string]: number[]; // e.g., { "2025-07-21": [1, 3] }
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<DailyProgress>({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [newHabit, setNewHabit] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const storedHabits = localStorage.getItem("dopamine-habits-grid");
    const storedProgress = localStorage.getItem("dopamine-progress-grid");
    if (storedHabits) setHabits(JSON.parse(storedHabits));
    if (storedProgress) setProgress(JSON.parse(storedProgress));
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (isClient)
      localStorage.setItem("dopamine-habits-grid", JSON.stringify(habits));
  }, [habits, isClient]);

  // Save progress to localStorage
  useEffect(() => {
    if (isClient)
      localStorage.setItem("dopamine-progress-grid", JSON.stringify(progress));
  }, [progress, isClient]);

  const handleAddHabit = () => {
    if (newHabit.trim() !== "") {
      const newHabitObject = { id: Date.now(), text: newHabit.trim() };
      setHabits([...habits, newHabitObject]);
      setNewHabit("");
      setIsDialogOpen(false);
    }
  };

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Dopamine Diary
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Build habits that make you feel good, one week at a time.
          </p>
        </header>

        {/* --- CONTROLS --- */}
        <div className="flex justify-between items-center mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="e.g., Wake up @ 7am"
                  onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                />
                <Button onClick={handleAddHabit} className="w-full">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* --- THE GRID --- */}
        <HabitGrid
          habits={habits}
          progress={progress}
          week={currentWeek}
          setHabits={setHabits}
          setProgress={setProgress}
        />

        {/* --- WEEKLY REPORT CARD --- */}
        {/* We only show the report if there are habits to track */}
        {habits.length > 0 && (
          <WeeklyReport
            habits={habits}
            progress={progress}
            week={currentWeek}
          />
        )}

        <footer className="text-center mt-8 text-muted-foreground text-sm">
          <p>Click the checkboxes to track your progress.</p>
        </footer>
      </div>
    </main>
  );
}
