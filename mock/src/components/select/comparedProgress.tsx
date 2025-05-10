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
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function ComparedProgress() {
  const { user } = useUser();

  const [nutrient, setNutrient] = useState("Calories");
  const [allAverages, setAllAverages] = useState<Record<string, number>>({});
  const [allRecommended, setAllRecommended] = useState<Record<string, number>>(
    {}
  );
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  const nutrients = ["Calories", "Sugar", "Carbs", "Protein"];

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
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Extract data for current nutrient
  function updateChartData(nutrientKey: string) {
    const avg = allAverages[nutrientKey] ?? 0;
    const rec = allRecommended[nutrientKey] ?? 0;

    setChartData({
      labels: [nutrientKey],
      datasets: [
        {
          label: "Average Intake",
          data: [avg],
          backgroundColor: "lightblue",
          borderColor: "blue",
          hoverBackgroundColor: "darkblue",
          borderWidth: 1,
        },
        {
          label: "Recommended",
          data: [rec],
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          borderColor: "red",
          borderWidth: 2,
          type: "bar",
        },
      ],
    });
  }

  useEffect(() => {
    if (!user?.id) return;

    async function fetchDataAndBuildChart() {
      const uid = user?.id;
      let averages: Record<string, number> = {};
      let recommendedMap: Record<string, number> = {
        Calories: 2000,
        Sugar: 15,
        Carbs: 40,
        Protein: 30,
      };

      try {
        const intakeRes = await fetch(
          `http://localhost:3232/get-daily?uid=${uid}`
        );
        const intakeData = await intakeRes.json();

        if (intakeData.response_type !== "success") {
          throw new Error("Invalid intake data response");
        }

        const logs = intakeData.data;
        const nutrientTotals: Record<string, number> = {
          Calories: 0,
          Sugar: 0,
          Carbs: 0,
          Protein: 0,
        };

        let count = 0;
        for (const date in logs) {
          const day = logs[date];
          for (const key of Object.keys(nutrientTotals)) {
            if (day[key] != null) {
              nutrientTotals[key] += Number(day[key]);
            }
          }
          count += 1;
        }

        for (const key of Object.keys(nutrientTotals)) {
          averages[key] = count > 0 ? nutrientTotals[key] / count : 0;
        }

        const profile_uid = "profile-" + uid;
        const recRes = await fetch(
          `http://localhost:3232/get-calories?uid=${profile_uid}`
        );
        const recData = await recRes.json();
        if (recData.response_type === "success" && recData.calories) {
          recommendedMap["Calories"] = Math.round(recData.calories);
        }

        setAllAverages(averages);
        setAllRecommended(recommendedMap);
        updateChartData(nutrient);
      } catch (e) {
        console.error("Error building chart:", e);
      }
    }

    fetchDataAndBuildChart();
  }, [user]);

  useEffect(() => {
    updateChartData(nutrient);
  }, [nutrient, allAverages, allRecommended]);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="progress-container">
      <label
        htmlFor="nutrient-select"
        style={{ marginBottom: "8px", display: "block" }}
      >
        Select Nutrient:
      </label>
      <select
        id="nutrient-select"
        value={nutrient}
        onChange={(e) => setNutrient(e.target.value)}
        style={{ marginBottom: "20px" }}
      >
        {nutrients.map((nutrient) => (
          <option key={nutrient} value={nutrient}>
            {nutrient.charAt(0) + nutrient.slice(1)}
          </option>
        ))}
      </select>

      <Bar data={chartData} options={options} />
    </div>
  );
}
