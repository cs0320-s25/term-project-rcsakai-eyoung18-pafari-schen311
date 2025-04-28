import '../../styles/main.css';
import { Dispatch, SetStateAction, forwardRef } from 'react';

// Remember that parameter names don't necessarily need to overlap;
// I could use different variable names in the actual function.
interface ControlledInputProps {
    value: number | undefined, 
    setValue: Dispatch<SetStateAction<number | undefined>>,
    ariaLabel: string,

  }
  
  // Input boxes contain state. We want to make sure React is managing that state,
  //   so we have a special component that wraps the input box.
  export const ControlledInput = forwardRef<HTMLInputElement, ControlledInputProps>(
    ({ value, setValue, ariaLabel }, ref) => {
      return (
        <input
          type="text"
          className="repl-command-box"
          value={value}
          placeholder="Enter your amount consumed today here!"
          onChange={(ev) => setValue(Number(ev.target.value))}
          aria-label={ariaLabel}
          ref={ref} // Forward the ref to the input element
        />
      );
    }
  );