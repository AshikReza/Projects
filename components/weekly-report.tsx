"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Habit, DailyProgress } from "@/app/page";
import { format, startOfWeek, addDays } from "date-fns";

// The custom tooltip for text is still needed for a clean look
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded-lg border bg-background shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">{`${label}`}</p>
        <p className="text-base font-bold text-foreground">{`Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface WeeklyReportProps {
  habits: Habit[];
  progress: DailyProgress;
  week: Date;
}

export const WeeklyReport = ({ habits, progress, week }: WeeklyReportProps) => {
  const totalHabits = habits.length;

  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(startOfWeek(week, { weekStartsOn: 1 }), i);
    const dateString = format(day, "yyyy-MM-dd");
    const completedCount = progress[dateString]?.length || 0;

    return {
      date: format(day, "EEE"),
      score: completedCount,
    };
  });

  const totalCompleted = weekData.reduce((sum, day) => sum + day.score, 0);
  const totalPossible = totalHabits * 7;
  const weeklyPercentage =
    totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Weekly Report</CardTitle>
        <CardDescription>
          Your performance for the week. You completed {totalCompleted} out of{" "}
          {totalPossible} possible habits ({weeklyPercentage}%).
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, totalHabits > 0 ? totalHabits : 5]}
            />

            {/* --- THE FIX IS HERE --- */}
            <Tooltip
              // This is the crucial change. It disables the background cursor completely.
              cursor={false}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="score"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Completed Habits"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
