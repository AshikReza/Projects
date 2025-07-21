"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { LoginForm } from "@/components/login";
import { HabitGrid } from "@/components/habit-grid";
import { WeeklyReport } from "@/components/weekly-report";
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
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Export types so other components can use them
export interface Habit {
  id: number;
  text: string;
}

export interface DailyProgress {
  [date: string]: number[]; // e.g., { "2025-07-21": [1, 3] }
}

export default function Home() {
  const { user, loading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<DailyProgress>({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [newHabit, setNewHabit] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Listen to data changes from Firestore
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setProgress({});
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setHabits(data.habits || []);
        setProgress(data.progress || {});
      }
    });

    // Unsubscribe from listener on cleanup
    return () => unsub();
  }, [user]);

  // Function to update Firestore
  const updateFirestore = (newData: {
    habits?: Habit[];
    progress?: DailyProgress;
  }) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    // Use setDoc with merge: true to create or update the document
    setDoc(userDocRef, newData, { merge: true });
  };

  const handleAddHabit = async () => {
    if (newHabit.trim() !== "") {
      const newHabitObject = { id: Date.now(), text: newHabit.trim() };
      const updatedHabits = [...habits, newHabitObject];
      setHabits(updatedHabits);
      await updateFirestore({ habits: updatedHabits });
      setNewHabit("");
      setIsDialogOpen(false);
    }
  };

  const handleSetHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    updateFirestore({ habits: newHabits });
  };

  const handleSetProgress = (newProgress: DailyProgress) => {
    setProgress(newProgress);
    updateFirestore({ progress: newProgress });
  };

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  if (loading) {
    return <p>Loading...</p>; // Or a loading skeleton
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Dopamine Diary
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Sign in to track your habits.
            </p>
          </header>
          <LoginForm />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Dopamine Diary
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Welcome, {user.email}!
            </p>
          </div>
          <Button variant="outline" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
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
          setHabits={handleSetHabits}
          setProgress={handleSetProgress}
        />

        {/* --- WEEKLY REPORT CARD --- */}
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
