import { Icon, List, SmilePlus } from "lucide-react";
import { mock } from "node:test";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import "../../styles/main.css";
import { ControlledSelect } from "./controlledSelect";
import { mock_set } from "./progress";
import { Frown, Meh, Smile } from "lucide-react";

interface InputProps {
  currentMacro: string;
  setCurrentMacro: Dispatch<SetStateAction<string>>;
}

export function HomePage(props: InputProps) {
  const [calorieString, setCalorie] = useState<string>("");
  const [proteinString, setProtein] = useState<string>("");
  const [carbString, setCarb] = useState<string>("");
  const [sugarString, setSugar] = useState<string>("");

  const searchRef = useRef<HTMLSelectElement | null>(null);

  const mockCalorieOptions = [
    "500-1000",
    "1001-1500",
    "1501-2000",
    "2001-2500",
    "2501-3000",
  ];
  const mockCarbOptions = ["10-20g", "21-30g", "31-40g", "41-50g"];
  const mockSugarOptions = ["5-10g", "11-15g", "16-20g", "21-25g"];
  const mockProteinOptions = ["10-20g", "21-30g", "31-40g", "41-50g"];

  function handleSelect(inputMacro: string) {
    if (!mock_set.headers.includes(inputMacro)) return;
    props.setCurrentMacro(inputMacro);
  }

  function handleSubmit(values: Record<string, string>) {
    const today = new Date().toISOString().slice(0, 10);

    Object.entries(values).forEach(([macro, stringValue]) => {
      const row_index = mock_set.headers.indexOf(macro);
      if (row_index === -1) {
        console.error(`Nutrient '${macro}' does not exist`);
        return;
      }

      // Extract number from string range like "500-1000" or "10-20g"
      const match = stringValue.match(/(\d+)/g);
      if (!match) {
        console.error(`Invalid format for ${macro}: ${stringValue}`);
        return;
      }
      const nums = match.map(Number);
      const inputAmount =
        nums.length === 1 ? nums[0] : Math.round((nums[0] + nums[1]) / 2);

      const foundRecord = mock_set.data.find(
        (record) => Object.keys(record)[0] === today
      );

      if (foundRecord) {
        foundRecord[today][row_index] += inputAmount;
      } else {
        const newValues = new Array(mock_set.headers.length).fill(0);
        newValues[row_index] = inputAmount;
        mock_set.data.push({ [today]: newValues });
      }
    });
  }

  const currentStreak: number = 20;

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
        <div className="input-box">
          <p>Calories</p>
          <ControlledSelect
            value={calorieString}
            setValue={setCalorie}
            ariaLabel="calorie input"
            options={mockCalorieOptions}
            ref={searchRef}
          />
        </div>
        <div className="input-box">
          <p>Carbohydrates</p>
          <ControlledSelect
            value={carbString}
            setValue={setCarb}
            ariaLabel="carb input"
            options={mockCarbOptions}
            ref={searchRef}
          />
        </div>
        <div className="input-box">
          <p>Sugars</p>
          <ControlledSelect
            value={sugarString}
            setValue={setSugar}
            ariaLabel="sugar input"
            options={mockSugarOptions}
            ref={searchRef}
          />
        </div>
        <div className="input-box">
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
            handleSubmit({
              Calories: calorieString,
              Carbohydrates: carbString,
              Sugars: sugarString,
              Protein: proteinString,
            })
          }
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
