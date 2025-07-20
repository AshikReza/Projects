"use client";

import { Habit, DailyProgress } from "@/app/page";
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
import { Trash2, GripVertical } from "lucide-react";
import { startOfWeek, addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

// --- DND-KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor, // Import TouchSensor for mobile
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// This SortableHabitRow component remains the same.
const SortableHabitRow = ({
  habit,
  weekDays,
  progress,
  handleToggleHabit,
  handleDeleteHabit,
}: {
  habit: Habit;
  weekDays: Date[];
  progress: DailyProgress;
  handleToggleHabit: (habitId: number, date: Date) => void;
  handleDeleteHabit: (habitId: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const todayFormatted = format(new Date(), "yyyy-MM-dd");

  return (
    <TableRow ref={setNodeRef} style={style} key={habit.id}>
      <TableCell className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            {...listeners}
            {...attributes}
            className="cursor-grab touch-none p-1" // Use touch-none for better compatibility
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </span>
          {habit.text}
        </div>
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
        const isChecked = (progress[dateString] || []).includes(habit.id);
        return (
          <TableCell
            key={day.toISOString()}
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
  );
};

// Main component with the crucial sensor changes
interface HabitGridProps {
  habits: Habit[];
  progress: DailyProgress;
  week: Date;
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
  // --- THE FIX IS HERE: SENSOR SETUP FOR BOTH MOUSE AND TOUCH ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // For mouse: require a 10px drag before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // For touch: require a 250ms press and hold before activating
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const todayFormatted = format(new Date(), "yyyy-MM-dd");
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfWeek(week, { weekStartsOn: 1 }), i);
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
    const newProgress = { ...progress };
    Object.keys(newProgress).forEach((date) => {
      newProgress[date] = newProgress[date].filter(
        (habitId) => habitId !== idToDelete
      );
    });
    setProgress(newProgress);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = habits.findIndex((h) => h.id === active.id);
      const newIndex = habits.findIndex((h) => h.id === over.id);
      setHabits(arrayMove(habits, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-full border rounded-lg p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] font-bold text-lg">Habit</TableHead>
            {weekDays.map((day) => {
              const isToday = todayFormatted === format(day, "yyyy-MM-dd");
              return (
                <TableHead
                  key={day.toISOString()}
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

        <DndContext
          sensors={sensors} // Using the new, improved sensor configuration
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={habits}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {habits.length > 0 ? (
                habits.map((habit) => (
                  <SortableHabitRow
                    key={habit.id}
                    habit={habit}
                    weekDays={weekDays}
                    progress={progress}
                    handleToggleHabit={handleToggleHabit}
                    handleDeleteHabit={handleDeleteHabit}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No habits yet. Add a new one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </SortableContext>
        </DndContext>

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
