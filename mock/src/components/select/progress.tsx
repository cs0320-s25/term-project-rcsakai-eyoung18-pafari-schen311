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
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDailyData } from "./fetchDaily";

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
  const [chartData, setChartData] = useState<Record<string, number[]>>({});
  const { user } = useUser();

  const [labels, setLabels] = useState<string[]>([]);
  const [selectedNutrient, setSelectedNutrient] = useState("Calories");

  const nutrientColors: Record<string, string> = {
    Calories: "red",
    Sugar: "orange",
    Carbs: "blue",
    Protein: "green",
  };

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      const res = await fetch(`http://localhost:3232/get-daily?uid=${user.id}`);
      const json = await res.json();
      if (json.response_type !== "success") {
        console.error("Failed to fetch daily data:", json.error);
        return;
      }
      const data = json.data;

      const dates = Object.keys(data).sort();
      const nutrients = {
        Calories: [] as number[],
        Sugar: [] as number[],
        Carbs: [] as number[],
        Protein: [] as number[],
      };

      for (const date of dates) {
        const entry = data[date];
        nutrients.Calories.push(Number(entry.Calories));
        nutrients.Sugar.push(Number(entry.Sugar));
        nutrients.Carbs.push(Number(entry.Carbs));
        nutrients.Protein.push(Number(entry.Protein));
      }

      setLabels(dates);
      setChartData(nutrients);
    }

    fetchData();
  }, [user]);

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
        <select
          id="nutrient-select"
          value={selectedNutrient}
          onChange={(e) => setSelectedNutrient(e.target.value)}
        >
          {Object.keys(chartData).map((nutrient) => (
            <option key={nutrient} value={nutrient}>
              {nutrient}
            </option>
          ))}
        </select>
      </div>
      {chart && chart.datasets[0].data.length > 0 ? (
        <Line data={chart} />
      ) : (
        <p>No daily inputs yet!</p>
      )}
    </div>
  );
}
