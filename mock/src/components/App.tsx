import "../styles/App.css";
import { Select } from "./select/Select";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { LoginButton } from "./LoginButton";

/**
 * Top-level app component with Clerk authentication
 */
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <h1 aria-label="Mock Header">Take Action for Your Health!</h1>
        <LoginButton />
      </div>

      <SignedIn>
        <Select />
      </SignedIn>

      <div id="modal-root"></div>
    </div>
  );
}

export default App;
