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
import { DailyEntry, useDailyData } from "./fetchDaily";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function ComparedProgress() {
  const { user } = useUser();
  const { dailyData, loading } = useDailyData();

  const [nutrient, setNutrient] = useState("Calories");
  const [allAverages, setAllAverages] = useState<Record<string, number>>({});
  const [allRecommended, setAllRecommended] = useState<Record<string, number>>(
    {}
  );
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  const nutrients = ["Calories", "Sugar", "Carbs", "Protein"];

  const labelToKey: Record<string, keyof DailyEntry> = {
    Calories: "Calories",
    Sugar: "Sugar",
    Carbs: "Carbs",
    Protein: "Protein",
  };

  const recommendedMap: Record<string, number> = {
    Calories: 2000,
    Sugar: 15,
    Carbs: 40,
    Protein: 30,
  };

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

  useEffect(() => {
    if (loading) return;

    const totals: Record<string, number> = {
      Calories: 0,
      Sugar: 0,
      Carbs: 0,
      Protein: 0,
    };

    let count = 0;

    for (const date in dailyData) {
      const entry = dailyData[date];
      for (const label of nutrients) {
        const key = labelToKey[label];
        const value = entry[key];
        if (value !== undefined && !isNaN(Number(value))) {
          totals[label] += Number(value);
        }
      }
      count += 1;
    }

    const averages: Record<string, number> = {};
    for (const nutrient of nutrients) {
      averages[nutrient] = count > 0 ? totals[nutrient] / count : 0;
    }

    setAllAverages(averages);
    setAllRecommended((prev) => ({ ...recommendedMap, ...prev }));
  }, [dailyData, loading]);

  useEffect(() => {
    fetchRecommended();
  }, [user?.id]);

  async function fetchRecommended() {
    try {
      const recRes = await fetch(
        `http://localhost:3232/get-calories?uid=profile-${user?.id}`
      );
      const recData = await recRes.json();

      const recommended = { ...recommendedMap };

      if (recData.response_type === "success" && recData.calories) {
        recommended["Calories"] = Math.round(recData.calories);
        recommended["Sugar"] = recData.sugar;
        recommended["Protein"] = recData.protein;
        recommended["Carbs"] = recData.carbs;
      }

      setAllRecommended(recommended);
    } catch (e) {
      console.error("Failed to fetch recommended intake:", e);
      setAllRecommended(recommendedMap); // fallback
    }
  }

  useEffect(() => {
    updateChartData(nutrient);
  }, [nutrient, allAverages, allRecommended]);

  function updateChartData(nutrientKey: string) {
    const avg = allAverages[nutrientKey];
    const rec = allRecommended[nutrientKey];

    const datasets = [];

    if (avg != null) {
      datasets.push({
        label: "Average Intake",
        data: [avg],
        backgroundColor: "lightblue",
        borderColor: "blue",
        hoverBackgroundColor: "darkblue",
        borderWidth: 2,
      });
    }

    if (rec != null) {
      datasets.push({
        label: "Recommended",
        data: [rec],
        backgroundColor: "lightcoral",
        borderColor: "red",
        hoverBackgroundColor: "darkred",
        borderWidth: 2,
      });
    }

    setChartData({
      labels: [nutrientKey],
      datasets,
    });
  }

  const avg = allAverages[nutrient];
  const rec = allRecommended[nutrient];
  const showNoData = avg == null && rec == null;

  return (
    <div className="progress-container">
      <div className="dropdown-container" style={{ marginBottom: "1rem" }}>
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
              {nutrient}
            </option>
          ))}
        </select>
      </div>
      {showNoData ? (
        <p>No daily inputs yet!</p>
      ) : (
        <Bar data={chartData!} options={options} />
      )}
    </div>
  );
}
