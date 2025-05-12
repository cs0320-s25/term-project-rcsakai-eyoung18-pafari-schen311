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

  const [labels, setLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Record<string, number[]>>({
    Calories: [],
    Sugar: [],
    Carbs: [],
    Protein: [],
  });

  const nutrientColors: Record<string, string> = {
    Calories: "red",
    Sugar: "orange",
    Carbs: "blue",
    Protein: "green",
  };

  // Sync dropdown selection to chart
  useEffect(() => {
    if (mock_set.headers.includes(nutrientString)) {
      setSelectedNutrient(nutrientString);
    }
  }, [nutrientString]);

  // Populate from mock_set
  useEffect(() => {
    const nutrients: Record<string, number[]> = {
      Calories: [],
      Sugar: [],
      Carbs: [],
      Protein: [],
    };

    const dates: string[] = [];

    for (const entry of mock_set.data) {
      const [date, values] = Object.entries(entry)[0];
      dates.push(date);
      for (let i = 0; i < mock_set.headers.length; i++) {
        nutrients[mock_set.headers[i]].push(values[i]);
      }
    }

    setLabels(dates);
    setChartData(nutrients);
  }, []);

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
          options={mock_set.headers}
          ref={searchRef}
        />
      </div>
      {chart && chart.datasets[0].data.length > 0 ? (
        <Line data={chart} />
      ) : (
        <p>No mock data available!</p>
      )}
    </div>
  );
}
