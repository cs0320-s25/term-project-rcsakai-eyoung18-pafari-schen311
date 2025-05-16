import "../../styles/main.css";
import { useState } from "react";
import { HomePage } from "./homepage";
import { Progress } from "./progress";
import { Feedback } from "./feedback";
import {
  Home,
  ChartNoAxesCombined,
  MessageSquareText,
  ChartSpline,
  CircleUserRound,
} from "lucide-react";
import { ComparedProgress } from "./comparedProgress";
import { Profile } from "./profile";

/**
 * Controls overall view of the website.
 */
export function Select() {
  const [currentPage, setCurrentPage] = useState("home");

  // Explicit click handlers
  const handleHomeClick = () => setCurrentPage("home");
  const handleProgressClick = () => setCurrentPage("personal graphs");
  const handleFeedbackClick = () => setCurrentPage("feedback");
  const handleComparedProgessClick = () => setCurrentPage("progress");
  const handleProfileClick = () => setCurrentPage("profile");
  const [currentMacro, setCurrentMacro] = useState<string>("");
  const [information, setInformation] = useState<
    [string, string, string, string, string, string, string, string]
  >(["", "", "", "", "", "", "", ""]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            currentMacro={currentMacro}
            setCurrentMacro={setCurrentMacro}
          />
        );
      case "personal graphs":
        return <Progress />;
      case "feedback":
        return <Feedback />;
      case "progress":
        return <ComparedProgress />;
      case "profile":
        return (
          <Profile information={information} setInformation={setInformation} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="select-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul className="flex flex-col space-y-8">
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleHomeClick}
          >
            <Home size={50} />
            <span className="text-lg">Home</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleComparedProgessClick}
          >
            <ChartNoAxesCombined size={50} />
            <span className="text-lg">Progress</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleProgressClick}
          >
            <ChartSpline size={50} />
            <span className="text-lg">Personal Graphs</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleFeedbackClick}
          >
            <MessageSquareText size={50} />
            <span className="text-lg">Feedback</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleProfileClick}
          >
            <CircleUserRound size={50} />
            <span className="text-lg">Profile</span>
          </li>
        </ul>
      </div>

      {/* Page Content */}
      <div className="main-content">{renderPage()}</div>
    </div>
  );
}
