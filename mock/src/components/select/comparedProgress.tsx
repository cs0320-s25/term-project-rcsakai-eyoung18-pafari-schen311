import "../../styles/main.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { mock_set } from "./progress";
import { useEffect, useState } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Returns average consumption from total data

export function ComparedProgress() {
  function average_list(input: number[][]): number[] {
    const input_length = input.length;
    if (input_length == 0) {
      return [];
    } else {
      const final_list: number[] = [];
      for (const list of input) {
        let list_total: number = 0;
        for (let i = 0; i < list.length; i++) {
          list_total += list[i];
        }
        final_list.push(list_total / list.length);
      }
      return final_list;
    }
  }

  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  const legendSymbols = ["■", "●", "▲"];

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"bar">) {
            const datasetIndex = tooltipItem.datasetIndex % 3;
            const symbol = legendSymbols[datasetIndex] || "";
            return `${symbol} The value of y is ${Number(tooltipItem.raw)}`;
          },
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const dataValues = mock_set.data.map((record) => Object.values(record)[0]);

    // Transpose rows into columns by header index
    const values = mock_set.headers.map((_, colIndex) =>
      dataValues.map((row) => row[colIndex])
    );
    console.log(values);
    const dataset_inputs = average_list(values);

    const recommendedMap: Record<string, number> = {
      Calories: 100,
      Sugar: 15,
      Carbs: 40,
      Protein: 30,
    };

    const recommendedLine = mock_set.headers.map(
      (header) => recommendedMap[header] ?? null
    );

    console.log(dataset_inputs);
    setChartData({
      labels: mock_set.headers,
      datasets: [
        {
          label: "Average Intake",
          backgroundColor: ["lightblue", "yellow", "pink", "lightgreen"],
          borderColor: ["blue", "brown", "red", "green"],
          hoverBackgroundColor: ["darkblue", "orange", "hotpink", "darkgreen"],
          borderWidth: 1,
          data: dataset_inputs,
        },
        {
          label: "Recommended",
          data: recommendedLine,
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          borderColor: "red",
          borderWidth: 2,
          type: "bar",
        },
      ],
    });
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="progress-container">
      <Bar data={chartData} options={options} />
    </div>
  );
}
