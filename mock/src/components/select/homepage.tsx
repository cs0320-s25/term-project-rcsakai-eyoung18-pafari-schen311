import { Icon, List, SmilePlus } from "lucide-react";
import { mock } from "node:test";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import "../../styles/main.css";
import { ControlledInput } from "./controlledInput";
import { mock_set } from "./progress";
import { Frown, Meh, Smile } from "lucide-react";

interface InputProps {
    currentMacro: string;
    setCurrentMacro: Dispatch<SetStateAction<string>>;
}
export function HomePage(props: InputProps) {
    const dropdownRef = useRef<HTMLSelectElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputValue, setInputValue] = useState<number>();
    const currentStreak: number = 20;

    function handleSelect(inputMacro: string) {
        if (!mock_set.headers.includes(inputMacro)) return;
            props.setCurrentMacro(inputMacro)
    }

    function handleSubmit (inputAmount: number) {
        let today = new Date().toISOString().slice(0, 10)
        const row_index = mock_set.headers.indexOf(props.currentMacro)
        if (row_index == -1) {
            console.error("That nutrient does not exist")
        }
        console.log(props.currentMacro)
        const foundRecord = mock_set.data.find(record => 
            Object.keys(record)[0] === today
          );
          
        if (foundRecord) {
            foundRecord[today][row_index] = inputAmount + foundRecord[today][row_index]
        }
        else {
            const newValues = new Array(mock_set.headers.length).fill(0);
            newValues[row_index] = inputAmount;
            const newAdd = { [today]: newValues };
            mock_set.data.push(newAdd);
        }
    }
    function happySadFace (currentStreak: number): JSX.Element | null {
        if (currentStreak == 0) {
            return <Frown size={50}/>;
        }
        else if (currentStreak > 0 && currentStreak < 5) {
            return <Meh size={50}/>;
        } 
        else if (currentStreak > 5 && currentStreak < 10) {
            return <Smile size={50}/>;
        }
        else if (currentStreak > 10) {
            return <SmilePlus size={50}/>;
        }
        return null
    }
    // to finish -- this saves the inputted information
    // const handleSubmitInformation
    // <button onClick={() => handleSubmitInformation()}>Save Information</button>
    return (
        <div className="homepage-container">
            <h1 className="homepage-header">Track Your Daily Diet!</h1>
            <select ref={dropdownRef}
                className="dropdown"
                aria-label="dataset dropdown"
                onChange={(e) => handleSelect(e.target.value)}>
                <option value="">Choose a Macronutrient</option>


                {mock_set.headers.map((nutrient) => (
                    <option key={nutrient} value={nutrient}>
                        {nutrient}
                    </option>
                ))}
            </select>
            <p></p>
            <ControlledInput 
            value={inputValue}
            setValue={setInputValue}
            ariaLabel="Command input"
            ref={inputRef} />
            <p></p>
            <button onClick={() => handleSubmit(inputValue ?? 0)}>Save Information</button>
            <div className="icon">
                {happySadFace(currentStreak)} Current Day Streak: {currentStreak}
            </div>

        </div>
    );  
}
