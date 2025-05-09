import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

/**
 * Builds a component that manage the login button and end-user's logged in state.
 *
 * @param props to access logged-in state (see interface loginProps for more details)
 * @returns JSX to let user know they can sign out if they are logged in
 *  or log-in if they are not logged in
 */
export function LoginButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <SignOutButton>
        <button aria-label="Sign Out">Sign out</button>
      </SignOutButton>
    );
  } else {
    return (
      <SignInButton>
        <button aria-label="Login">Login</button>
      </SignInButton>
    );
  }
}
