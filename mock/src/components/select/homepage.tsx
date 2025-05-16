import { Icon, List, SmilePlus } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import "../../styles/main.css";
import { Frown, Meh, Smile } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useDailyData } from "./fetchDaily";
import { ControlledInputProfile } from "./controlledInputsProfile";
import { SearchApi } from "./SearchApi";

interface InputProps {
  currentMacro: string;
  setCurrentMacro: Dispatch<SetStateAction<string>>;
}

interface searchProps {
  search_value: string;
  result: string;
}
export function HomePage(props: InputProps) {
  const [calorieString, setCalorie] = useState<string>("");
  const [proteinString, setProtein] = useState<string>("");
  const [carbString, setCarb] = useState<string>("");
  const [sugarString, setSugar] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [searchOutput, setSearchOutput] = useState<string>("");
  const [hasSearchOutput, setHasSearchOutput] = useState<boolean>(false);

  const { user } = useUser();

  const mock_search_set: searchProps[] = [
    {
      search_value: "how much protein does beef have",
      result:
        "The amount of protein in beef depends on the cut and preparation method. Here's a general breakdown for cooked, lean beef: \
      100 grams (3.5 oz) of cooked lean ground beef (10% fat) contains about 26 grams of protein. \
      100 grams of steak (e.g., sirloin, ribeye) typically contains 25–28 grams of protein.",
    },
    {
      search_value: "how much sugar does 70% dark chocolate have",
      result:
        "70% dark chocolate typically contains about 24–28 grams of sugar per 100 grams (3.5 oz), depending on the brand.",
    },
    {
      search_value:
        "how many calories are in 2 pounds of skinless, boneless chicken thighs",
      result:
        "Two pounds of skinless, boneless chicken thighs contain approximately 1,090–1,200 calories, depending on fat content and cooking method.",
    },
  ];

  function isPositiveNumber(value: string): boolean {
    const num = Number(value);
    return value !== "" && !isNaN(num) && num >= 0;
  }

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

    const keys = ["calories", "sugar", "carbs", "protein"];
    for (const key of keys) {
      const val = values[key];
      if (val && !isPositiveNumber(val)) {
        alert(`Invalid input for ${key}. Please enter a positive number.`);
        return;
      }
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
  function handleSearch(prompt: string) {
    const output = mock_search_set.filter((m) => m.search_value == prompt);
    if (output.length > 0) {
      setHasSearchOutput(true);
      setSearchOutput(output[0].result);
    } else {
      setHasSearchOutput(false);
    }
  }

  const { dailyData, loading } = useDailyData();
  function getLocalYYYYMMDD(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  function computeStreak(data: Record<string, any>): number {
    const enteredDates = new Set(Object.keys(data));
    let streak = 0;

    let currentDate = new Date();

    while (true) {
      const dateStr = getLocalYYYYMMDD(currentDate);
      if (enteredDates.has(dateStr)) {
        console.log("this works");
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        console.log(dateStr);
        console.log(enteredDates.has(dateStr));
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
    } else if (currentStreak >= 5 && currentStreak < 10) {
      return <Smile size={50} />;
    } else if (currentStreak >= 10) {
      return <SmilePlus size={50} />;
    }
    return null;
  }

  return (
    <div className="homepage-container">
      <h1 className="homepage-header">Track Your Daily Diet:</h1>
      <div className="date">
        <label htmlFor="log-date">Select Date: </label>
        <input
          type="date"
          id="log-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="input-row">
        <div className="input-box-calorie">
          <p>Calories</p>
          <ControlledInputProfile
            value={calorieString}
            setValue={setCalorie}
            ariaLabel="calorie input"
            placeholder="Enter calories in kcal"
          />
        </div>
        <div className="input-box-carbo">
          <p>Carbohydrates</p>
          <ControlledInputProfile
            value={carbString}
            setValue={setCarb}
            ariaLabel="carb input"
            placeholder="Enter carbs in g"
          />
        </div>
        <div className="input-box-sugar">
          <p>Sugars</p>
          <ControlledInputProfile
            value={sugarString}
            setValue={setSugar}
            ariaLabel="sugar input"
            placeholder="Enter sugars in g"
          />
        </div>
        <div className="input-box-protein">
          <p>Protein</p>
          <ControlledInputProfile
            value={proteinString}
            setValue={setProtein}
            ariaLabel="protein input"
            placeholder="Enter proteins in g"
          />
        </div>
      </div>
      <div className="search-box">
        <p>How many nutrients did my food have?</p>
        <ControlledInputProfile
          value={search}
          setValue={setSearch}
          ariaLabel="search inpiut"
          placeholder="Inquire"
        />
      </div>
      <button onClick={() => handleSearch(search)} className="search-button">
        Search
      </button>
      <SearchApi output={searchOutput} hasSearch={hasSearchOutput} />
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
        aria-label="save-button"
      >
        Save Information
      </button>
      <div className="icon">
        {happySadFace(currentStreak)} Current Day Streak: {currentStreak}
      </div>
    </div>
  );
}
