import { Icon, List, SmilePlus } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import "../../styles/main.css";
import { Frown, Meh, Smile } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useDailyData } from "./fetchDaily";
import { ControlledInputProfile } from "./controlledInputsProfile";

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
      Calories: values.calories || "no input",
      Sugar: values.sugar || "no input",
      Carbs: values.carbs || "no input",
      Protein: values.protein || "no input",
    });
  
    fetch(`http://localhost:3232/add-daily?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response_type === "success") {
          console.log("Daily log added successfully.");      
        } else {
          console.error("Failed to add daily log:", data.error);
        }
      });
      setCalorie("");
      setCarb("");
      setDate("");
      setSugar("");
      setProtein("");
  }
  
  const { dailyData, loading } = useDailyData();
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
  console.log(dailyData)
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
          <ControlledInputProfile
            value={calorieString}
            setValue={setCalorie}
            ariaLabel="calorie input"
            placeholder="Enter calories"
          />
        </div>
        <div className="input-box-carbo">
          <p>Carbohydrates</p>
          <ControlledInputProfile
            value={carbString}
            setValue={setCarb}
            ariaLabel="carb input"
            placeholder="Enter carbs"
          />
        </div>
        <div className="input-box-sugar">
          <p>Sugars</p>
          <ControlledInputProfile
            value={sugarString}
            setValue={setSugar}
            ariaLabel="sugar input"
            placeholder="Enter sugars"
          />
        </div>
        <div className="input-box-protein">
          <p>Protein</p>
          <ControlledInputProfile
            value={proteinString}
            setValue={setProtein}
            ariaLabel="protein input"
            placeholder="Enter proteins"
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
