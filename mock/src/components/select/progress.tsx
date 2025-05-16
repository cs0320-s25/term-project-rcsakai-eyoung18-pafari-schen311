import "../../styles/main.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  ChartData,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { ControlledSelect } from "./controlledSelect";
import { DailyEntry, useDailyData } from "./fetchDaily";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export interface tableLayout {
  headers: Array<string>;
  data: Array<Record<string, number[]>>;
}

export const mock_set: tableLayout = {
  headers: ["Calories", "Sugar", "Carbs", "Protein"],
  data: [
    { "1-2-2025": [100, 20, 10, 7] },
    { "1-7-2025": [120, 15, 15, 4] },
    { "1-9-2025": [70, 25, 12, 9] },
  ],
};

export function Progress() {
  const searchRef = useRef<HTMLSelectElement | null>(null);
  const [nutrientString, setNutrient] = useState<string>("Calories");
  const [selectedNutrient, setSelectedNutrient] = useState("Calories");

  const { dailyData, loading } = useDailyData();
  const [labels, setLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Record<string, number[]>>({
    Calories: [],
    Sugar: [],
    Carbs: [],
    Protein: [],
  });

  const nutrientOptions = ["Calories", "Sugar", "Carbs", "Protein"];

  const labelToKey: Record<string, keyof DailyEntry> = {
    Calories: "Calories",
    Sugar: "Sugar",
    Carbs: "Carbs",
    Protein: "Protein",
  };

  const nutrientColors: Record<string, string> = {
    Calories: "red",
    Sugar: "orange",
    Carbs: "blue",
    Protein: "green",
  };

  // Sync dropdown selection to chart
  useEffect(() => {
    if (nutrientOptions.includes(nutrientString)) {
      setSelectedNutrient(nutrientString);
    }
  }, [nutrientString]);

  // Populate from dailyData
  useEffect(() => {
    const nutrients: Record<string, number[]> = {
      Calories: [],
      Sugar: [],
      Carbs: [],
      Protein: [],
    };

    const sortedDates = Object.keys(dailyData).sort();
    const dates: string[] = [];

    for (const date of sortedDates) {
      const entry = dailyData[date];
      dates.push(date);

      for (const label of nutrientOptions) {
        const key = labelToKey[label];
        const value = entry[key];
        nutrients[label].push(value ? parseFloat(value) : 0);
      }
    }

    setLabels(dates);
    setChartData(nutrients);
  }, [dailyData, loading]);

  console.log(dailyData);

  const chart: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: selectedNutrient,
        data: chartData[selectedNutrient] || [],
        borderColor: nutrientColors[selectedNutrient],
        backgroundColor: "rgba(190, 190, 190, 0.9)",
      },
    ],
  };

  return (
    <div className="progress-container">
      <div className="dropdown-container" style={{ marginBottom: "1rem" }}>
        <label htmlFor="nutrient-select">Select Nutrient: </label>
        <ControlledSelect
          value={nutrientString}
          setValue={setNutrient}
          ariaLabel="nutrient select"
          options={nutrientOptions}
          ref={searchRef}
        />
      </div>
      {chart && chart.datasets[0].data.length > 0 ? (
        <Line data={chart} />
      ) : (
        <p>No daily inputs yet!</p>
      )}
    </div>
  );
}
