import { useRef, useState } from "react";
import "../../styles/main.css";
import { ControlledInput } from "./controlledInput";

export function HomePage() {
    const [calorieString, setCalorie] = useState<string>('');
    const [proteinString, setProtein] = useState<string>('');
    const [carbString, setCarb] = useState<string>('');
    const [sugarString, setSugar] = useState<string>('');

    const searchRef = useRef<HTMLInputElement | null>(null);

    // to finish -- this saves the inputted information
    // const handleSubmitInformation
    // <button onClick={() => handleSubmitInformation()}>Save Information</button>
    return (
        <div className="homepage-container">
            <h1 className="homepage-header">Track Your Daily Diet!</h1>
            <div className="input-row">
                <div className="input-box">
                    <p>Calories</p>
                    <ControlledInput
                        value={calorieString}
                        setValue={setCalorie}
                        ariaLabel="calorie input"
                        ref={searchRef}
                    />
                </div>
                <div className="input-box">
                    <p>Carbohydrates</p>
                    <ControlledInput
                        value={carbString}
                        setValue={setCarb}
                        ariaLabel="carb input"
                        ref={searchRef}
                    />
                </div>
                <div className="input-box">
                    <p>Sugars</p>
                    <ControlledInput
                        value={sugarString}
                        setValue={setSugar}
                        ariaLabel="sugar input"
                        ref={searchRef}
                    />
                </div>
                <div className="input-box">
                    <p>Protein</p>
                    <ControlledInput
                        value={proteinString}
                        setValue={setProtein}
                        ariaLabel="protein input"
                        ref={searchRef}
                    />
                </div>
                <div className="input-box">
                    <p>Weight</p>
                    <ControlledInput
                        value={carbString}
                        setValue={setCarb}
                        ariaLabel="carb input"
                        ref={searchRef}
                    />
                </div>
                <div className="input-box">
                    <p>Height</p>
                    <ControlledInput
                        value={carbString}
                        setValue={setCarb}
                        ariaLabel="carb input"
                        ref={searchRef}
                    />
                </div>
            </div>
        </div>
    );
    
}
