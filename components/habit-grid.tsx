"use client";

import { Habit, DailyProgress } from "@/app/page"; // We'll update page.tsx to export these
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { startOfWeek, addDays, format } from "date-fns";
import { cn } from "@/lib/utils"; // Import the cn utility

// Props for our new component
interface HabitGridProps {
  habits: Habit[];
  progress: DailyProgress;
  week: Date; // The current week to display
  setHabits: (habits: Habit[]) => void;
  setProgress: (progress: DailyProgress) => void;
}

export const HabitGrid = ({
  habits,
  progress,
  week,
  setHabits,
  setProgress,
}: HabitGridProps) => {
  // Get today's date, formatted to easily compare with other dates.
  const todayFormatted = format(new Date(), "yyyy-MM-dd");

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    // We get the start of the week (Monday) and add `i` days to it
    const day = addDays(startOfWeek(week, { weekStartsOn: 1 }), i);
    return day;
  });

  const handleToggleHabit = (habitId: number, date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const completedOnDate = progress[dateString] || [];
    const isCompleted = completedOnDate.includes(habitId);

    const newCompleted = isCompleted
      ? completedOnDate.filter((id) => id !== habitId)
      : [...completedOnDate, habitId];

    setProgress({ ...progress, [dateString]: newCompleted });
  };

  const handleDeleteHabit = (idToDelete: number) => {
    setHabits(habits.filter((habit) => habit.id !== idToDelete));
    // Also remove from progress data to keep things clean
    const newProgress = { ...progress };
    Object.keys(newProgress).forEach((date) => {
      newProgress[date] = newProgress[date].filter(
        (habitId) => habitId !== idToDelete
      );
    });
    setProgress(newProgress);
  };

  return (
    <div className="w-full border rounded-lg p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] font-bold text-lg">Habit</TableHead>
            {weekDays.map((day) => {
              // Check if the current day in the loop is today
              const isToday = todayFormatted === format(day, "yyyy-MM-dd");
              return (
                <TableHead
                  key={day.toISOString()}
                  // Use `cn` to conditionally add a background color
                  className={cn("text-center", {
                    "bg-gray-300 rounded-t-lg": isToday,
                  })}
                >
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(day, "d")}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {habits.length > 0 ? (
            habits.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell className="font-medium flex items-center justify-between">
                  {habit.text}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </TableCell>
                {weekDays.map((day) => {
                  const isToday = todayFormatted === format(day, "yyyy-MM-dd");
                  const dateString = format(day, "yyyy-MM-dd");
                  const isChecked = (progress[dateString] || []).includes(
                    habit.id
                  );
                  return (
                    <TableCell
                      key={day.toISOString()}
                      // Also apply the highlight to the body cells
                      className={cn("text-center", { "bg-muted": isToday })}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleHabit(habit.id, day)}
                        className="w-5 h-5"
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No habits yet. Add a new one to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-bold">Total Score</TableCell>
            {weekDays.map((day) => {
              const isToday = todayFormatted === format(day, "yyyy-MM-dd");
              const dateString = format(day, "yyyy-MM-dd");
              const score = progress[dateString]?.length || 0;
              return (
                <TableCell
                  key={day.toISOString()}
                  // And finally, apply the highlight to the footer cells
                  className={cn("text-center font-bold text-lg", {
                    "bg-muted rounded-b-lg": isToday,
                  })}
                >
                  {score}
                </TableCell>
              );
            })}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};