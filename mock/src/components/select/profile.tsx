import { Dispatch, SetStateAction, useState, useEffect } from "react";
import "../../styles/main.css";
import { ControlledInputProfile } from "./controlledInputsProfile";
import { useUser } from "@clerk/clerk-react";

interface profileProps {
  information: [string, string, string, string, string, string, string, string];
  setInformation: Dispatch<
    SetStateAction<
      [string, string, string, string, string, string, string, string]
    >
  >;
}

export function Profile(props: profileProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const { user } = useUser();

  // Individual states for each input field
  const [name, setName] = useState<string>(
    (props.information[0] as string) || ""
  );
  const [sex, setSex] = useState<string>(
    (props.information[1] as string) || ""
  );
  const [birthday, setBirthday] = useState<string>(
    (props.information[2] as string) || ""
  );
  const [height, setHeight] = useState<string>(
    (props.information[3] as string) || ""
  );
  const [weight, setWeight] = useState<string>(
    (props.information[4] as string) || ""
  );
  const [activityLevel, setActivityLevel] = useState<string>(
    (props.information[5] as string) || ""
  );
  const [heightUnit, setHeightUnit] = useState<string>(
    (props.information[6] as string) || ""
  );
  const [weightUnit, setWeightUnit] = useState<string>(
    (props.information[7] as string) || ""
  );

  useEffect(() => {
    if (user?.id) {
      const uid = "profile-" + user.id;
      fetch(`http://localhost:3232/get-user-profile?uid=${uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.response_type === "success" && data.profile) {
            const {
              name,
              sex,
              birthday,
              height,
              weight,
              activityLevel,
              heightUnit,
              weightUnit,
            } = data.profile;
            setName(name);
            setSex(sex);
            setBirthday(birthday);
            setHeight(height);
            setWeight(weight);
            setActivityLevel(activityLevel);
            setHeightUnit(heightUnit);
            setWeightUnit(weightUnit);
            props.setInformation([
              name,
              sex,
              birthday,
              height,
              weight,
              activityLevel,
              heightUnit,
              weightUnit,
            ]);
          }
        });
    }
  }, [user?.id]);

  function handleSave() {
    const safeHeightUnit = heightUnit || "cm";
    const safeWeightUnit = weightUnit || "kg";
    const safeActivityLevel = activityLevel || "Inactive";

    props.setInformation([
      name,
      sex,
      birthday,
      height,
      weight,
      activityLevel,
      heightUnit,
      weightUnit,
    ]);
    setEditMode(false);

    const uid = user?.id;

    if (!uid) {
      console.error("User is not authenticated.");
      return;
    }

    const params = new URLSearchParams({
      uid: uid,
      sex,
      name,
      birthday,
      height,
      weight,
      activityLevel: safeActivityLevel,
      heightUnit: safeHeightUnit,
      weightUnit: safeWeightUnit,
    });

    fetch(`http://localhost:3232/add-user-profile?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response_type === "success") {
          console.log("Profile saved successfully.");
        } else {
          console.error("Failed to save profile:", data.error);
        }
      });
  }

  function handleEdit() {
    setEditMode(true);
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profile</h1>

      <div className="profile-button-group">
        {editMode ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Information
          </button>
        )}
      </div>

      <ul className="profile-list">
        {/* Name */}
        <li className="profile-item">
          <span className="profile-label">Name</span>
          {editMode ? (
            <ControlledInputProfile
              value={name}
              setValue={setName}
              ariaLabel="Name input"
              placeholder="Enter your name"
            />
          ) : (
            <span className="profile-value">{name}</span>
          )}
        </li>
        {/* Sex */}
        <li className="profile-item">
          <span className="profile-label">Sex</span>
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => setSex("Male")}
                className={`px-3 py-1 rounded ${
                  sex === "Male" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setSex("Female")}
                className={`px-3 py-1 rounded ${
                  sex === "Female" ? "bg-pink-500 text-white" : "bg-gray-200"
                }`}
              >
                Female
              </button>
            </div>
          ) : (
            <span className="profile-value">{sex}</span>
          )}
        </li>

        {/* Birthday */}
        <li className="profile-item">
          <span className="profile-label">Birthday</span>
          {editMode ? (
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          ) : (
            <span className="profile-value">{birthday}</span>
          )}
        </li>

        {/* Height */}
        <li className="profile-item">
          <span className="profile-label">Height</span>
          {editMode ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border px-2 py-1 rounded w-24"
                placeholder="Enter height"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value as "cm" | "in")}
                className="border px-2 py-1 rounded"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          ) : (
            <span className="profile-value">
              {height} {heightUnit}
            </span>
          )}
        </li>

        {/* Weight */}
        <li className="profile-item">
          <span className="profile-label">Weight</span>
          {editMode ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border px-2 py-1 rounded w-24"
                placeholder="Enter weight"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as "kg" | "lbs")}
                className="border px-2 py-1 rounded"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          ) : (
            <span className="profile-value">
              {weight} {weightUnit}
            </span>
          )}
        </li>
        {/* Activity Level */}
        <li className="profile-item">
          <span className="profile-label">Activity Level</span>
          {editMode ? (
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="Inactive">Inactive</option>
              <option value="Low Active">Low Active</option>
              <option value="Active">Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          ) : (
            <span className="profile-value">{activityLevel}</span>
          )}
        </li>
      </ul>
    </div>
  );
}
