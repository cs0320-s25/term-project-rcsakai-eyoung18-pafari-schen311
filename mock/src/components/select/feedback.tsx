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

const nutrientUnits: Record<string, string> = {
  Calories: "kcal",
  Sugar: "g",
  Carbs: "g",
  Protein: "g",
};

// Mock food recommendations by nutrient and score ranges
const foodRecommendations: Record<
  string,
  {
    veryLow: string;
    slightlyLow: string;
    onTarget: string;
    slightlyHigh?: string;
    veryHigh?: string;
  }
> = {
  Calories: {
    veryLow: "Avocado, nuts, olive oil",
    slightlyLow: "Whole grains, chicken breast",
    onTarget: "Keep doing what you're doing!",
    slightlyHigh: "Monitor portion sizes",
    veryHigh: "Reduce fried foods and sugary drinks",
  },
  Sugar: {
    veryLow: "No special recommendation",
    slightlyLow: "No special recommendation",
    onTarget: "Keep doing what you're doing!",
    slightlyHigh: "Cut back on desserts and soda",
    veryHigh: "Avoid sweets and processed snacks",
  },
  Carbs: {
    veryLow: "Sweet potatoes, legumes, brown rice",
    slightlyLow: "Whole grain bread, oats",
    onTarget: "Keep doing what you're doing!",
    slightlyHigh: "Reduce refined carbs like white bread",
    veryHigh: "Avoid sugary snacks and white flour products",
  },
  Protein: {
    veryLow: "Lean meats, beans, tofu",
    slightlyLow: "Greek yogurt, eggs",
    onTarget: "Keep doing what you're doing!",
    slightlyHigh: "Monitor excessive protein supplements",
    veryHigh: "Balance protein intake to avoid kidney strain",
  },
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

  // Calculate feedback with food recommendations
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
    let foodRecommendation = "";

    if (nutrient === "Sugar") {
      if (avg > rec) {
        description = "Too much sugar. Try to reduce your intake.";
        foodRecommendation = foodRecommendations[nutrient].veryHigh ?? "";
      } else {
        description = "You're staying within the sugar limit. Well done!";
        foodRecommendation = foodRecommendations.Sugar.onTarget;
      }
    } else if (avg < rec * 0.7) {
      description = `Your ${nutrient.toLowerCase()} intake is very low. Consider increasing it significantly.`;
      foodRecommendation = foodRecommendations[nutrient].veryLow;
    } else if (avg < rec * 0.9) {
      description = `Your ${nutrient.toLowerCase()} intake is slightly low. Try to increase it.`;
      foodRecommendation = foodRecommendations[nutrient].slightlyLow;
    } else if (avg > rec * 1.3) {
      description = `Your ${nutrient.toLowerCase()} intake is very high. Consider reducing it significantly.`;
      foodRecommendation = foodRecommendations[nutrient].veryHigh ?? "";
    } else if (avg > rec * 1.1) {
      description = `Your ${nutrient.toLowerCase()} intake is slightly high. Try to reduce it.`;
      foodRecommendation = foodRecommendations[nutrient].slightlyHigh ?? "";
    } else {
      description = `Your ${nutrient.toLowerCase()} intake is on target. Great job!`;
      foodRecommendation = foodRecommendations[nutrient].onTarget;
    }

    return {
      nutrient,
      avg,
      rec,
      score,
      description,
      foodRecommendation,
    };
  }).filter(Boolean) as {
    nutrient: string;
    avg: number;
    rec: number;
    score: number;
    description: string;
    foodRecommendation: string;
  }[];

  // Calculate overall score (average of all nutrient scores)
  const overallScore =
    feedback.length > 0
      ? Math.round(
          feedback.reduce((acc, f) => acc + f.score, 0) / feedback.length
        )
      : 0;

  return (
    <div className="feedback-container">
      {feedback.length === 0 ? (
        <p>No data yet. Please input some daily entries.</p>
      ) : (
        <>
          <div className="overall-score-box" style={{ marginBottom: "1.5rem" }}>
            <h3>Overall Score: {overallScore}/100</h3>
            <p>
              {overallScore > 90
                ? "Excellent job maintaining a balanced diet!"
                : overallScore > 75
                ? "Good job! Keep improving your diet."
                : overallScore > 50
                ? "Fair, but there is room for improvement."
                : "Consider making significant changes to your diet."}
            </p>
          </div>

          <ul className="feedback-list">
            {feedback.map((item) => (
              <li
                key={item.nutrient}
                className="input-box-calorie feedback-card"
                style={{ marginBottom: "1rem" }}
              >
                <h4>{item.nutrient}</h4>
                <p>
                  Average Intake:{" "}
                  {item.avg != null
                    ? `${item.avg.toFixed(2)} ${nutrientUnits[item.nutrient]}`
                    : "N/A"}
                </p>
                <p>
                  {item.nutrient === "Sugar"
                    ? "Max Recommended"
                    : "Recommended"}
                  : {`${item.rec} ${nutrientUnits[item.nutrient]}`}
                </p>
                <p>Score: {item.score}/100</p>
                <p>{item.description}</p>
                {item.foodRecommendation && (
                  <p>
                    <strong>Recommended foods: </strong>
                    {item.foodRecommendation}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
