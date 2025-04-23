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
  ChartData
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export interface tableLayout {
  headers: Array<string>;
  data: Array<Array<number>>;
}

const mock_set: tableLayout = {
  headers: ["sugar", "carbs", "proteins"],
  data: [
    [1, 2, 3],
    [3, 4, 5],
    [2, 4, 6]
  ]
};

export function Progress() {
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);

  useEffect(() => {
    const [sugar, carbs, proteins] = mock_set.headers.map((_, colIndex) =>
      mock_set.data.map(row => row[colIndex])
    );

    setChartData({
      labels: ["Day 1", "Day 2", "Day 3"],
      datasets: [
        {
          label: "Sugar",
          data: sugar,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)"
        },
        {
          label: "Carbs",
          data: carbs,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)"
        },
        {
          label: "Protein",
          data: proteins,
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.1)"
        }
      ]
    });
  }, []);

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Your Nutrient Intake Over Time</h2>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}