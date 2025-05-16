import "../../styles/main.css";
import { DailyEntry, useDailyData } from "./fetchDaily";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const NUTRIENTS = ["Calories", "Sugar", "Carbs", "Protein"];

const labelToKey: Record<string, keyof DailyEntry> = {
  Calories: "Calories",
  Sugar: "Sugar",
  Carbs: "Carbs",
  Protein: "Protein",
};

export function Feedback() {
  const { dailyData, loading } = useDailyData();
  const { user } = useUser();

  const [averages, setAverages] = useState<Record<string, number>>({});
  const [recommended, setRecommended] = useState<Record<string, number>>({
    Calories: 0,
    Sugar: 0,
    Carbs: 0,
    Protein: 0,
  });

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
      for (const nutrient of NUTRIENTS) {
        const key = labelToKey[nutrient];
        const value = entry[key];
        if (value !== undefined && !isNaN(Number(value))) {
          totals[nutrient] += Number(value);
        }
      }
      count += 1;
    }

    const avg: Record<string, number> = {};
    for (const nutrient of NUTRIENTS) {
      avg[nutrient] = count > 0 ? totals[nutrient] / count : 0;
    }

    setAverages(avg);
  }, [dailyData, loading]);

  useEffect(() => {
    fetchRecommended();
  }, [user?.id]);

  async function fetchRecommended() {
    try {
      const res = await fetch(
        `http://localhost:3232/get-calories?uid=profile-${user?.id}`
      );
      const data = await res.json();
      if (data.response_type === "success") {
        setRecommended({
          Calories: Math.round(data.calories),
          Sugar: data.sugar,
          Protein: data.protein,
          Carbs: data.carbs,
        });
      }
    } catch (e) {
      console.error("Failed to fetch recommended intake", e);
    }
  }

  const feedback = NUTRIENTS.map((nutrient) => {
    const avg = averages[nutrient];
    const rec = recommended[nutrient];

    if (rec === 0) return null;

    let score: number;
    if (nutrient === "Sugar") {
      if (avg <= rec) {
        score = 100;
      } else {
        const diffPercent = ((avg - rec) / rec) * 100;
        score = Math.max(0, Math.round(100 - diffPercent));
      }
    } else {
      const diffPercent = Math.abs((avg - rec) / rec) * 100;
      score = Math.max(0, Math.round(100 - diffPercent));
    }

    let description = "";
    if (nutrient === "Sugar") {
      if (avg > rec) {
        description = "Too much sugar. Try to reduce your intake.";
      } else {
        description = "You're staying within the sugar limit. Well done!";
      }
    } else if (avg < rec * 0.7) {
      description = `Your ${nutrient.toLowerCase()} intake is very low. Consider increasing it significantly.`;
    } else if (avg < rec * 0.9) {
      description = `Your ${nutrient.toLowerCase()} intake is slightly low. Try to increase it.`;
    } else if (avg > rec * 1.3) {
      description = `Your ${nutrient.toLowerCase()} intake is very high. Consider reducing it significantly.`;
    } else if (avg > rec * 1.1) {
      description = `Your ${nutrient.toLowerCase()} intake is slightly high. Try to reduce it.`;
    } else {
      description = `Your ${nutrient.toLowerCase()} intake is on target. Great job!`;
    }

    return {
      nutrient,
      avg,
      rec,
      score,
      description,
    };
  }).filter(Boolean);

  return (
    <div className="feedback-container">
      {feedback.length === 0 ? (
        <p>No data yet. Please input some daily entries.</p>
      ) : (
        <ul className="feedback-list">
          {feedback.map((item) =>
            item ? (
              <li
                key={item.nutrient}
                className="input-box-calorie feedback-card"
              >
                <p>{item.nutrient}</p>
                <p>
                  Average Intake:{" "}
                  {item.avg != null ? item.avg.toFixed(2) : "N/A"}
                </p>
                <p>
                  {item.nutrient === "Sugar"
                    ? "Max Recommended"
                    : "Recommended"}
                  : {item.rec}
                </p>
                <p>Score: {item.score}/100</p>
                <p>{item.description}</p>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
