import "../../styles/main.css";
import { Dispatch, SetStateAction, forwardRef } from "react";

// Remember that parameter names don't necessarily need to overlap;
// I could use different variable names in the actual function.
interface ControlledSelectProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
  options: string[];
}

// Input boxes contain state. We want to make sure React is managing that state,
//   so we have a special component that wraps the input box.
export const ControlledSelect = forwardRef<
  HTMLSelectElement,
  ControlledSelectProps
>(({ value, setValue, ariaLabel, options }, ref) => {
  return (
    <select
      className="repl-command-box"
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
      ref={ref}
    >
      <option value="" disabled>
        Select a value
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
});
