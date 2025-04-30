import { Dispatch, SetStateAction, useState } from "react";
import "../../styles/main.css";
import { ControlledInputProfile } from "./controlledInputsProfile";

interface profileProps {
  information: [string, string, number, number];
  setInformation: Dispatch<SetStateAction<[string, string, number, number]>>;
}

export function Profile(props: profileProps) {
  const [editMode, setEditMode] = useState<boolean>(false);

  // Individual states for each input field
  const [name, setName] = useState<string>(props.information[0] as string || "");
  const [birthday, setBirthday] = useState<string>(props.information[1] as string || "");
  const [height, setHeight] = useState<number>(Number(props.information[2]) || 0);
  const [weight, setWeight] = useState<number>(Number(props.information[3]) || 0);

  function handleSave() {
    props.setInformation([name, birthday, height, weight]);
    setEditMode(false);
  }

  function handleEdit() {
    setEditMode(true);
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profile</h1>

      <div className="profile-button-group">
        {editMode ? (
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Information
          </button>
        ) : (
          <button onClick={handleEdit} className="bg-green-500 text-white px-4 py-2 rounded">
            Edit Information
          </button>
        )}
      </div>

      <ul className="profile-list">
        {["Name", "Birthday", "Height", "Weight"].map((label, i) => {
          const value = [name, birthday, height, weight][i];
          const setValue = [setName, setBirthday, setHeight, setWeight][i];
          const placeholders = [
            "Enter your name",
            "MM/DD/YYYY",
            "Enter height in cm",
            "Enter weight in kg"
          ];

          return (
            <li key={label} className="profile-item">
              <span className="profile-label">{label}</span>
              {editMode ? (
                <ControlledInputProfile
                  value={value}
                  setValue={setValue}
                  ariaLabel={`${label} input`}
                  placeholder={placeholders[i]}
                />
              ) : (
                <span className="profile-value">{value}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
