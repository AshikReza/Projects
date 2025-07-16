"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// Import the specific types you need from chart.js
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the component's props with the correct types
interface GraphBlockProps {
  // Use ChartData for the data prop. The <'line'> generic makes it specific to a line chart.
  data: ChartData<"line">;
  // Use ChartOptions for the options prop.
  options: ChartOptions<"line">;
}

const GraphBlock = ({ data, options }: GraphBlockProps) => {
  return <Line data={data} options={options} />;
};

export default GraphBlock;
