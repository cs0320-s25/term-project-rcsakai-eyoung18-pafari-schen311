import { Icon, List, SmilePlus } from "lucide-react";
import { mock } from "node:test";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import "../../styles/main.css";
import { ControlledSelect } from "./controlledSelect";
//import { mock_set } from "./progress";
import { Frown, Meh, Smile } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useDailyData } from "./fetchDaily";

interface InputProps {
  currentMacro: string;
  setCurrentMacro: Dispatch<SetStateAction<string>>;
}

export function HomePage(props: InputProps) {
  const [calorieString, setCalorie] = useState<string>("");
  const [proteinString, setProtein] = useState<string>("");
  const [carbString, setCarb] = useState<string>("");
  const [sugarString, setSugar] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const { user } = useUser();

  const searchRef = useRef<HTMLSelectElement | null>(null);

  const mockCalorieOptions = ["1000", "1500", "2000", "2500", "3000"];
  const mockCarbOptions = ["10", "20", "30", "40"];
  const mockSugarOptions = ["5", "10", "15", "20"];
  const mockProteinOptions = ["20", "30", "40", "50"];

  // function handleSelect(inputMacro: string) {
  //   if (!mock_set.headers.includes(inputMacro)) return;
  //   props.setCurrentMacro(inputMacro);
  // }

  function handleSubmit(values: Record<string, string>, date: string) {
    const uid = user?.id;

    if (!uid) {
      console.error("User is not authenticated.");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      console.error("Date cannot be in the future.");
      alert("Please select a date that is not in the future.");
      return;
    }

    const params = new URLSearchParams({
      uid: uid,
      date: date,
      calories: values.calories || "no input",
      sugar: values.sugar || "no input",
      carbs: values.carbs || "no input",
      protein: values.protein || "no input",
    });

    fetch(`http://localhost:3232/add-daily?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response_type === "success") {
          console.log("Daily log added successfully.");
          console.log(data)
        } else {
          console.error("Failed to add daily log:", data.error);
        }
      });
  }
  const { dailyData, loading } = useDailyData();
  console.log(dailyData.key)
  function computeStreak(data: Record<string, any>): number {
    const enteredDates = new Set(Object.keys(data));
    let streak = 0;

    let currentDate = new Date();

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (enteredDates.has(dateStr)) {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  const currentStreak = computeStreak(dailyData);

  function happySadFace(currentStreak: number): JSX.Element | null {
    if (currentStreak == 0) {
      return <Frown size={50} />;
    } else if (currentStreak > 0 && currentStreak < 5) {
      return <Meh size={50} />;
    } else if (currentStreak > 5 && currentStreak < 10) {
      return <Smile size={50} />;
    } else if (currentStreak > 10) {
      return <SmilePlus size={50} />;
    }
    return null;
  }

  // to finish -- this saves the inputted information
  // const handleSubmitInformation
  // <button onClick={() => handleSubmitInformation()}>Save Information</button>
  return (
    <div className="homepage-container">
      <h1 className="homepage-header">Track Your Daily Diet!</h1>
      <div className="input-row">
        <div>
          <label htmlFor="log-date">Select Date:</label>
          <input
            type="date"
            id="log-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="input-box-calorie">
          <p>Calories</p>
          <ControlledSelect
            value={calorieString}
            setValue={setCalorie}
            ariaLabel="calorie input"
            options={mockCalorieOptions}
            ref={searchRef}
          />
        </div>
        <div className="input-box-carbo">
          <p>Carbohydrates</p>
          <ControlledSelect
            value={carbString}
            setValue={setCarb}
            ariaLabel="carb input"
            options={mockCarbOptions}
            ref={searchRef}
          />
        </div>
        <div className="input-box-sugar">
          <p>Sugars</p>
          <ControlledSelect
            value={sugarString}
            setValue={setSugar}
            ariaLabel="sugar input"
            options={mockSugarOptions}
            ref={searchRef}
          />
        </div>
        <div className="input-box-protein">
          <p>Protein</p>
          <ControlledSelect
            value={proteinString}
            setValue={setProtein}
            ariaLabel="protein input"
            options={mockProteinOptions}
            ref={searchRef}
          />
        </div>
        <p></p>
        <button
          onClick={() =>
            handleSubmit(
              {
                calories: calorieString,
                carbs: carbString,
                sugar: sugarString,
                protein: proteinString,
              },
              date
            )
          }
          className="saveinfo"
        >
          Save Information
        </button>
        <div className="icon">
          {happySadFace(currentStreak)} Current Day Streak: {currentStreak}
        </div>
      </div>
    </div>
  );
}
