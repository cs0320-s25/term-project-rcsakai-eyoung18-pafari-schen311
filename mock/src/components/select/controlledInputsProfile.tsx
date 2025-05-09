import '../../styles/main.css';
import { Dispatch, SetStateAction, forwardRef } from 'react';

interface ControlledInputProfileProps<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  ariaLabel: string;
  placeholder?: string;
}

export const ControlledInputProfile = forwardRef<HTMLInputElement, ControlledInputProfileProps<any>>(
  ({ value, setValue, ariaLabel, placeholder }, ref) => {
    return (
      <input
        type="text"
        className="repl-command-box"
        value={value ?? ''}
        placeholder={placeholder || "Enter value"}
        onChange={(ev) => {
          const input = ev.target.value;
          // Handle number vs string input
          if (typeof value === "number") {
            const parsed = Number(input);
            setValue(isNaN(parsed) ? undefined : parsed);
          } else {
            setValue(input);
          }
        }}
        aria-label={ariaLabel}
        ref={ref}
      />
    );
  }
);
