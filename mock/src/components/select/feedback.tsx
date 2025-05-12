import "../../styles/main.css";
import { mock_set } from "./progress";

export function Feedback() {
  const recommendedMap: Record<string, number> = {
    Calories: 100,
    Sugar: 15,
    Carbs: 40,
    Protein: 30,
  };

  const dataValues = mock_set.data.map((record) => Object.values(record)[0]);

  const averages = mock_set.headers.map((_, colIndex) => {
    const values = dataValues.map((row) => row[colIndex]);
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  });

  const feedback = mock_set.headers.map((header, i) => {
    const avg = averages[i];
    const recommended = recommendedMap[header];
    const diffPercent = Math.abs((avg - recommended) / recommended) * 100;
    const score = Math.max(0, Math.round(100 - diffPercent));

    let description = "";
    if (avg > recommended * 1.1) {
      description = `Too high in ${header.toLowerCase()}. Try to reduce it.`;
    } else if (avg < recommended * 0.9) {
      description = `Too low in ${header.toLowerCase()}. Try to increase it.`;
    } else {
      description = `Your ${header.toLowerCase()} intake is on target. Good job!`;
    }

    return { header, avg, recommended, score, description };
  });
  console.log(feedback)
  return (
    <div className="feedback-container">
      <h2 className="text-xl font-semibold mb-4">
        Nutritional Feedback</h2>
        <ul>
        {feedback.map(({ header, avg, recommended, score, description }) => (
          <li key={header} className="bg-white rounded p-3 shadow">
            <p className="font-medium">{header}</p>
            <p>Average Intake: {avg.toFixed(2)}</p>
            <p>Recommended: {recommended}</p>
            <p>Score: {score}/100</p>
            <p className="italic text-sm">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
