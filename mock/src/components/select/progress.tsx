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
  data: Array<Record<string, number[]>>;
}

export const mock_set: tableLayout = {
  headers: ["sugar", "carbs", "Protein"],
  data: [{"1-2-2025": [5, 10, 7]}, 
  {"1-7-2025": [4, 15, 4]}, 
  {"1-9-2025": [7, 12, 9]}, 
  ]
};

export function Progress() {
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);

  useEffect(() => {
    const dataValues = mock_set.data.map(record => Object.values(record)[0]);
    const [sugar, carbs, proteins] = mock_set.headers.map((_, colIndex) =>
      dataValues.map(row => row[colIndex])
    );

    const dates = mock_set.data.map(record => Object.keys(record)[0]);

    setChartData({
      labels: dates,
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
    <div className="progress-container">
      {chartData ? (
        <Line data={chartData} /> ) : (
      <p>Loading chart...</p>
      )}
    </div>
  );
}